# DEELER BACKEND

## Setup

1. Copy the `.env-example` and rename to `.env`
2. Run `npm install` to fetch dependencies
3. Run `npm run seed` to seed database and  run `npm start` to start the project
4. Go ham on those APIs, see endpoints below

*** see package.json for a list of other communds available when working with the project

## Possible Improvements
Codebase could benefit from refactors and improvements such as:
- Implement input validation to the apis
- Better logging
- Add styling/linting - code quality uniformity checks on commit
- Containerize make ready for deployment
- Add separate configs for dev, prod, staging
- Add Admin type of profile and create middleware to only allow admins access admin routes
- Tests and Coverage
- in the balances/deposit/:userId route should probably remove the :userId param - already have it passed in header
- Caching those queries
- Migrations

## Technical Notes
- The server is running on port 3001 by default. You can change this in the `.env` file
- To authenticate users use the `getProfile` middleware that is located under src/middleware/getProfile.js. users are authenticated by passing `profile_id` in the request header. after a user is authenticated his profile will be available under `req.profile`. make sure only users that are on the contract can access their contracts.
- 
### App Components

Laid out in respective directory by function. Important ones are

- Models - `src/models/`
- Controllers - `src/controllers`
- Middleware - `src/middleware`

#### Profile
A profile can be either a `client` or a `contractor`. 
clients create contracts with contractors. contractor does jobs for clients and get paid.
Each profile has a balance property.

#### Contract
A contract between and client and a contractor.
Contracts have 3 statuses, `new`, `in_progress`, `terminated`. contracts are considered active only when in status `in_progress`
Contracts group jobs within them.

#### Job
contractor get paid for jobs by clients under a certain contract.

  

## APIs Implemented

Below is a list of the available API's for the application.


1. ***GET*** `/contracts/:id` - It should return the contract only if it belongs to the profile calling.

2. ***GET*** `/contracts` - Returns a list of contracts belonging to a user (client or contractor), the list should only contain non terminated contracts.

3. ***GET*** `/jobs/unpaid` -  Get all unpaid jobs for a user (***either*** a client or contractor), for ***active contracts only***.

4. ***POST*** `/jobs/:job_id/pay` - Pay for a job, a client can only pay if his balance >= the amount to pay. The amount should be moved from the client's balance to the contractor balance.

5. ***POST*** `/balances/deposit/:userId` - Deposits money into the the the balance of a client, a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)

6. ***GET*** `/admin/best-profession?start=<date>&end=<date>` - Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range.

7. ***GET*** `/admin/best-clients?start=<date>&end=<date>&limit=<integer>` - returns the clients the paid the most for jobs in the query time period. limit query parameter should be applied, default limit is 2.
```
 [
    {
        "id": 1,
        "fullName": "Reece Moyer",
        "paid" : 100.3
    },
    {
        "id": 200,
        "fullName": "Debora Martin",
        "paid" : 99
    },
    {
        "id": 22,
        "fullName": "Debora Martin",
        "paid" : 21
    }
]
```

  

