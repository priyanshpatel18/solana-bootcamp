/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/voting.json`.
 */
export type Voting = {
  "address": "6z68wfurCMYkZG51s1Et9BJEd9nJGUusjHXNt4dGbNNF",
  "metadata": {
    "name": "voting",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "initializeCandidate",
      "discriminator": [
        210,
        107,
        118,
        204,
        255,
        97,
        112,
        26
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "pollAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "pollId"
              }
            ]
          }
        },
        {
          "name": "candidateAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "pollId"
              },
              {
                "kind": "arg",
                "path": "candidateName"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "pollId",
          "type": "u64"
        },
        {
          "name": "candidateName",
          "type": "string"
        }
      ]
    },
    {
      "name": "initializePoll",
      "discriminator": [
        193,
        22,
        99,
        197,
        18,
        33,
        115,
        117
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "pollAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "pollId"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "pollId",
          "type": "u64"
        },
        {
          "name": "pollName",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "pollStart",
          "type": "u64"
        },
        {
          "name": "pollEnd",
          "type": "u64"
        }
      ]
    },
    {
      "name": "vote",
      "discriminator": [
        227,
        110,
        155,
        23,
        136,
        126,
        172,
        25
      ],
      "accounts": [
        {
          "name": "signer",
          "signer": true
        },
        {
          "name": "candidateAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "pollId"
              },
              {
                "kind": "arg",
                "path": "candidateName"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "pollId",
          "type": "u64"
        },
        {
          "name": "candidateName",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "candidateAccount",
      "discriminator": [
        69,
        203,
        73,
        43,
        203,
        170,
        96,
        121
      ]
    },
    {
      "name": "pollAccount",
      "discriminator": [
        109,
        254,
        117,
        41,
        232,
        74,
        172,
        45
      ]
    }
  ],
  "types": [
    {
      "name": "candidateAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pollId",
            "type": "u64"
          },
          {
            "name": "candidateName",
            "type": "string"
          },
          {
            "name": "candidateVotes",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "pollAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pollId",
            "type": "u64"
          },
          {
            "name": "pollName",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "pollStart",
            "type": "u64"
          },
          {
            "name": "pollEnd",
            "type": "u64"
          },
          {
            "name": "candidateAmount",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
