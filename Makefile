
# AIPEDIA Custom Build and Run (delegates to aipedia/Makefile)
build:
	@echo "Building with AIPEDIA configuration..."
	$(MAKE) -C aipedia build

run:
	@echo "Running with AIPEDIA configuration..."
	$(MAKE) -C aipedia run

# Original LibreChat commands
build-original:
	podman-compose -f docker-compose.yml -f docker-compose.override.yml up --build

run-original:
	podman-compose -f docker-compose.yml -f docker-compose.override.yml up -d

# AIPEDIA Custom Commands (delegates to aipedia/Makefile)
down:
	$(MAKE) -C aipedia down

deploy:
	$(MAKE) -C aipedia deploy

logs:
	$(MAKE) -C aipedia logs

shell:
	$(MAKE) -C aipedia shell

status:
	$(MAKE) -C aipedia status

sync:
	$(MAKE) -C aipedia sync

setup-upstream:
	$(MAKE) -C aipedia setup-upstream

# Original LibreChat commands
down-original:
	podman-compose down

deploy-original:
	git pull
	podman-compose down
	podman-compose -f docker-compose.yml -f docker-compose.override.yml up -d
	sudo service nginx reload

applogs:
	podman logs -f LibreChat

appsh:
	podman exec -it LibreChat /bin/sh

apprm:
	podman rmi -f localhost/librechat:latest || true

# MONGO QUERY

mongo:
	podman exec -it chat-mongodb sh

add_balance:
	podman exec -it LibreChat npm run add-balance $(EMAIL) $(BALANCE)

add_pro:
	podman exec -it LibreChat npm run add-balance $(EMAIL) 4500000

add_trial:
	podman exec -it LibreChat npm run add-balance $(EMAIL) 5000

list_users:
	podman exec chat-mongodb mongo LibreChat --eval 'db.users.find({}, {name: 1, username: 1, email: 1, emailVerified: 1, plugins: 1, _id: 0}).sort({_id: -1}).limit(10).pretty()'

total_users:
	podman exec chat-mongodb mongo LibreChat --eval 'db.users.find({}).count()'

add_plugins:
	podman exec chat-mongodb mongo LibreChat --eval 'db.users.updateMany({plugins: []}, {$set: {plugins: ["dalle", "google"]}})'

check_balances:
	/bin/bash aipedia/mongo.sh

check_user_balance:
	/bin/bash aipedia/user_balance.sh $(EMAIL)

remove-images:
	podman rmi \
		localhost/librechat:latest \
		docker.io/library/node:20-alpine \
		ghcr.io/danny-avila/librechat-rag-api-dev-lite:latest \
		docker.io/getmeili/meilisearch:v1.12.3 \
		docker.io/ankane/pgvector:latest \
		docker.io/library/mongo:4.4.18

BACKUP_DIR=./mongo_backup
CONTAINER=chat-mongodb
RESTORE_DIR=/data/restore

.PHONY: backup restore clean-restore

backup:
	podman exec $(CONTAINER) mongodump --db LibreChat --out /data/backup
	podman cp $(CONTAINER):/data/backup $(BACKUP_DIR)

restore: clean-restore
	podman cp $(BACKUP_DIR)/LibreChat $(CONTAINER):$(RESTORE_DIR)
	podman exec $(CONTAINER) mongorestore --drop $(RESTORE_DIR)

clean-restore:
	podman exec -it $(CONTAINER) mongo --eval 'db.getMongo().getDBNames().forEach(function(d){ if (!["admin","local","config"].includes(d)) db.getSiblingDB(d).dropDatabase(); })'
