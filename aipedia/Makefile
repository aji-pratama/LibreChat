# AIPEDIA Custom LibreChat Management
# This Makefile handles syncing from original repo and custom deployment

.PHONY: sync build run down deploy logs shell clean backup restore

# Sync from original LibreChat repository
sync:
	@echo "Syncing from original LibreChat repository..."
	cd .. && git fetch upstream
	cd .. && git merge upstream/main
	@echo "Sync completed. Review changes before deploying."

# Add upstream remote if not exists
setup-upstream:
	@echo "Setting up upstream remote..."
	cd .. && git remote add upstream https://github.com/danny-avila/LibreChat.git || true
	cd .. && git fetch upstream

# Build with custom configuration
build:
	@echo "Building LibreChat with AIPEDIA custom configuration..."
	@cd .. && podman-compose -f docker-compose.yml -f aipedia/docker-compose.override.makna.yml build

# Run with custom configuration
run:
	@echo "Starting LibreChat with AIPEDIA configuration..."
	@cd .. && podman-compose -f docker-compose.yml -f aipedia/docker-compose.override.makna.yml up -d

# Stop containers
down:
	@echo "Stopping LibreChat containers..."
	@cd .. && podman-compose -f docker-compose.yml -f aipedia/docker-compose.override.makna.yml down

# Deploy (pull, build, run)
deploy:
	@echo "Deploying LibreChat with latest changes..."
	cd .. && git pull
	make down
	make build
	make run
	@echo "Deployment completed!"

# View application logs
logs:
	@echo "Viewing LibreChat logs..."
	@cd .. && podman-compose -f docker-compose.yml -f aipedia/docker-compose.override.makna.yml logs -f

# Access application shell
shell:
	@echo "Accessing LibreChat API shell..."
	@podman exec -it librechat-api /bin/bash

# Clean up containers and images
clean:
	@echo "Cleaning up containers and images..."
	cd .. && podman-compose -f docker-compose.yml -f aipedia/docker-compose.override.makna.yml down --rmi all --volumes
	cd .. && podman system prune -f

# Backup custom configurations
backup:
	@echo "Backing up AIPEDIA configurations..."
	tar -czf ../aipedia-backup-$(shell date +%Y%m%d-%H%M%S).tar.gz .
	@echo "Backup created in parent directory"

# Restore from backup
restore:
	@echo "To restore from backup, extract the tar.gz file to this directory"
	@echo "Usage: tar -xzf ../aipedia-backup-YYYYMMDD-HHMMSS.tar.gz"

# Check status
status:
	@echo "Checking container status..."
	cd .. && podman-compose -f docker-compose.yml -f aipedia/docker-compose.override.makna.yml ps

# Update dependencies
update:
	@echo "Updating dependencies..."
	cd .. && npm update
	cd ../api && npm update
	cd ../client && npm update

# Help
help:
	@echo "AIPEDIA LibreChat Management Commands:"
	@echo "  setup-upstream  - Add upstream remote for syncing"
	@echo "  sync           - Sync from original LibreChat repo"
	@echo "  build          - Build with custom configuration"
	@echo "  run            - Run with custom configuration"
	@echo "  start          - Build and run"
	@echo "  down           - Stop containers"
	@echo "  deploy         - Full deployment (pull, build, run)"
	@echo "  logs           - View application logs"
	@echo "  shell          - Access application shell"
	@echo "  clean          - Clean up containers and images"
	@echo "  backup         - Backup custom configurations"
	@echo "  restore        - Instructions for restoring backup"
	@echo "  status         - Check container status"
	@echo "  update         - Update dependencies"
	@echo "  help           - Show this help message"