module.exports = {
    presets: [
        ["@babel/env",
            {
                targets: {
                    node: "current"
                }
            }
        ]
    ],
    plugins: [
        ["inline-json-import", {}],
        [
            "@babel/plugin-proposal-decorators",
            {
                "legacy": true
            }
        ],
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-object-rest-spread"
    ],
    env: {
        "test": {
            "plugins": [
                [
                    "istanbul"
                ]
            ]
        }
    },
    sourceMaps: true
};
