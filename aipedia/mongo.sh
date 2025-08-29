#!/bin/bash
podman exec chat-mongodb mongo LibreChat --eval 'db.balances.aggregate([
    {
        $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "userDetails"
        }
    },
    {
        $unwind: "$userDetails"
    },
    {
        $project: {
            _id: 0,
            email: "$userDetails.email",
            balance: "$tokenCredits",
            createdAt: 1  // Pastikan ada field timestamp, ganti jika berbeda
        }
    },
    {
        $sort: { createdAt: -1 }
    },
    {
        $limit: 10
    }
])'
