# [1.0.0-alpha.11](https://github.com/Basis-Theory/basis-theory-js/compare/v1.0.0-alpha.10...v1.0.0-alpha.11) (2021-05-12)


### Features

* **ENG-461:** adds create Atomic Bank ([d0a0fab](https://github.com/Basis-Theory/basis-theory-js/commit/d0a0fabfa08077d16f3508aa489adc7a7232cadb))

# [1.0.0-alpha.10](https://github.com/Basis-Theory/basis-theory-js/compare/v1.0.0-alpha.9...v1.0.0-alpha.10) (2021-05-06)


### Bug Fixes

* **ENG-285:** add id to atomic card model ([608e4fc](https://github.com/Basis-Theory/basis-theory-js/commit/608e4fc2e24cfe859723179796ec0734a6a715a6))

# [1.0.0-alpha.9](https://github.com/Basis-Theory/basis-theory-js/compare/v1.0.0-alpha.8...v1.0.0-alpha.9) (2021-05-06)


### Bug Fixes

* **ENG-392:** adds exported BasisTheoryApiError type and Error class ([3627f22](https://github.com/Basis-Theory/basis-theory-js/commit/3627f2233247b70947fc4f42f5c0cadfa344d788))

# [1.0.0-alpha.8](https://github.com/Basis-Theory/basis-theory-js/compare/v1.0.0-alpha.7...v1.0.0-alpha.8) (2021-05-04)


### Bug Fixes

* **ENG-298:** remove created_by and modified_by ([60c9035](https://github.com/Basis-Theory/basis-theory-js/commit/60c903520eaf46357dae6abc2f48237995dc32af))
* **ENG-298:** remove createdBy and modifiedBy ([cf8b789](https://github.com/Basis-Theory/basis-theory-js/commit/cf8b789551fe9d9b1739841c87e48ab61e54f6f9))


### Code Refactoring

* **ENG-298:** rename folders and change response type ([33d724d](https://github.com/Basis-Theory/basis-theory-js/commit/33d724da7ce3616dbc5aa47df6852c1e5d7dcc0f))


### BREAKING CHANGES

* **ENG-298:** `createToken` and `getToken` now resolve to `CreateTokenResponse`

# [1.0.0-alpha.7](https://github.com/Basis-Theory/basis-theory-js/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2021-04-21)


### Bug Fixes

* **ENG-249:** chore: add upload echo messages ([e48c256](https://github.com/Basis-Theory/basis-theory-js/commit/e48c256e7399b670f9837cf109cbe194eb36e4af))
* **ENG-249:** use http for local env ([81b358f](https://github.com/Basis-Theory/basis-theory-js/commit/81b358f8a2b56296f05f69df204001a727611048))
* **ENG-249:** use JS_HOST var to load elements from ([21d2b5e](https://github.com/Basis-Theory/basis-theory-js/commit/21d2b5eefa6a9a96d682571889e0c78e26f00c15))

# [1.0.0-alpha.6](https://github.com/Basis-Theory/basis-theory-js/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2021-04-14)


### Bug Fixes

* perform deep key case change ([bf2847d](https://github.com/Basis-Theory/basis-theory-js/commit/bf2847dfaf7306394486884d1a37790e6d3a29d7))
* update card creation contract ([4a08fea](https://github.com/Basis-Theory/basis-theory-js/commit/4a08feab5b0cbb4f5570dbd1d80edf8767100e7d))

# [1.0.0-alpha.5](https://github.com/Basis-Theory/basis-theory-js/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2021-04-09)


### Features

* add BasisTheoryElements dynamic loading ([4d679e5](https://github.com/Basis-Theory/basis-theory-js/commit/4d679e5af667c29cf031a473e53367e63b84fd15))

# [1.0.0-alpha.4](https://github.com/Basis-Theory/basis-theory-js/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2021-04-06)


### Bug Fixes

* :alien: change payments source API interface ([7b4f4ab](https://github.com/Basis-Theory/basis-theory-js/commit/7b4f4ab84ff9668549aea854d4685789f0176630))

# [1.0.0-alpha.3](https://github.com/Basis-Theory/basis-theory-js/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2021-02-22)


### Bug Fixes

* typo in package main property ([0238c88](https://github.com/Basis-Theory/basis-theory-js/commit/0238c88cf2ff4d761dc7b91eebf2ad59ff43639d))

# [1.0.0-alpha.2](https://github.com/Basis-Theory/basis-theory-js/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2021-02-19)


### Features

* add IaC pulumi code ([81b2977](https://github.com/Basis-Theory/basis-theory-js/commit/81b29777814f569659228f5f05e3276a78419de0))

# 1.0.0-alpha.1 (2021-02-17)


### Bug Fixes

* add missing local 'vault' path section ([33dbd1c](https://github.com/Basis-Theory/basis-theory-js/commit/33dbd1c7f333fb314d76159e439f050d28579ef4))
* change sandbox base urls ([9593332](https://github.com/Basis-Theory/basis-theory-js/commit/95933324bec6e3be84b46ddf312e08f42420a317))
* local environment back to localhost ([d3fa5ef](https://github.com/Basis-Theory/basis-theory-js/commit/d3fa5eff51a1a555e07a904a034ae9fb026be568))


### Features

* :sparkles: add encryption service ([f538a59](https://github.com/Basis-Theory/basis-theory-js/commit/f538a59326b118351978e3288313624a4e2dd123))
* add mock vault service ([87c017e](https://github.com/Basis-Theory/basis-theory-js/commit/87c017e0a67a8c4ed0d28e01269853ca785e1e41))
* **vault:** add delete token ([86ba4f0](https://github.com/Basis-Theory/basis-theory-js/commit/86ba4f09c49f23f1038a071a9c1bf3fb14be13cb))
* **vault:** add retrieveToken ([1b7dec2](https://github.com/Basis-Theory/basis-theory-js/commit/1b7dec29a36ea3e7b4b0c073864f56e317d0ec20))
* add credit card example ([cdc5c96](https://github.com/Basis-Theory/basis-theory-js/commit/cdc5c960564ab822e25cce9db721bffb9a89699c))
* add mock server for running examples/tests ([062c0c3](https://github.com/Basis-Theory/basis-theory-js/commit/062c0c3500660be03f1277b7bb26b990229df8de))
