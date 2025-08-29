#!/bin/bash

# Pastikan untuk menerima email sebagai argumen
EMAIL="$1"

# Cek apakah email telah diberikan
if [ -z "$EMAIL" ]; then
    echo "Usage: $0 email@example.com"
    exit 1
fi

podman exec chat-mongodb mongo LibreChat --eval "
db.balances.aggregate([
    {
        \$lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'userDetails'
        }
    },
    {
        \$unwind: '\$userDetails'
    },
    {
        \$match: {
            'userDetails.email': '$EMAIL'
        }
    },
    {
        \$project: {
            _id: 0,
            email: '\$userDetails.email',
            balance: '\$tokenCredits'
        }
    }
])
" --quiet
