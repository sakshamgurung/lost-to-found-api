# Lost to Found

Lost to found is a web app where users can search for lost or found items. Users also can submit items they have lost or found. Users can search for a lost/found item by category or full-text search. Users can provide images and geolocation in their submissions.

![Homepage](/public/readme%20assests/screenshot/2%20My%20submission%20detail.png)

![Full text search](/public/readme%20assests/screenshot/3%20Search%20by%20full%20text.png)

### Adding New Submission

![Adding new submission](/public/readme%20assests/gif/1%20Add%20Submission%20gif.gif)

### Searching for found item

![Searching for submission](/public/readme%20assests/gif/2%20Search%20gif.gif)

## How it works

![lost to found architecture](/public/readme%20assests/diagram/restWebServices.png)

Lost to found web app is based on client-server architecture. There are three layers:

1. Next js Front-end: This layer uses RESTful api to request for lost/found submissions and full-text search. It renders the response from Node js server.
2. Node js Server: This layer handles RESTful endpoints for request/response. This layer uses RedisOM to map JS objects with Redis JSON documents and Hashses. This layer connects with Redis database for any CRUD and search operations.
3. Redis Database Server: This layer is hosted on Docker. It perform any database related operations as requested by Node js server.

### How the data is stored:

- Data are stored in 3 modals:

  - account:

    ```javascript
    let accountSchema = new Schema(
    	Account,
    	{
    		name: { type: "string" },
    		email: { type: "string" },
    		password: { type: "string" },
    		tokens: { type: "string[]" },
    	},
    	{
    		dataStructure: "JSON",
    	}
    );
    ```

  - category:

    ```javascript
    let categorySchema = new Schema(
    	Category,
    	{
    		name: { type: "string" },
    		description: { type: "text" },
    	},
    	{
    		dataStructure: "JSON",
    	}
    );
    ```

  - submission:

    ```javascript
    let submissionSchema = new Schema(
    	Submission,
    	{
    		userId: { type: "string" },
    		type: { type: "string" },
    		status: { type: "string" },
    		//sortable as asce or desc order
    		date: { type: "date", sortable: true },
    		category: { type: "string" },
    		itemName: { type: "string" },
    		location1: { type: "point" },
    		location2: { type: "point" },
    		location3: { type: "point" },
    		//full-text search
    		description: { type: "text" },
    		email: { type: "string" },
    		imageUrl: { type: "string[]" },
    	},
    	{
    		dataStructure: "JSON",
    	}
    );
    ```

### How the data is accessed:

- submission: Below are functions which uses Redis-om client to access data from Redis database server. Function's parameters are accessed either from request body or request params.

  - ```javascript
    async function getAllSubmissionByUser(userId) {
    	await connect();
    	const submissionRepo = client.fetchRepository(submissionSchema);
    	const submissions = await submissionRepo.search().where("userId").equals(userId).return.all();
    	return submissions;
    }
    ```

  - ```javascript
    async function getSubmissionByLatestDate(excludeUserId, submissionType) {
    	await connect();
    	const submissionRepo = client.fetchRepository(submissionSchema);
    	const submissions = await submissionRepo
    		.search()
    		.where("userId")
    		.does.not.equal(excludeUserId)
    		.and("type")
    		.equals(submissionType)
    		.sortBy("date", "DESC")
    		.return.all();
    	return submissions;
    }
    ```

  - ```javascript
    async function searchSubmissionsByCategory(excludeUserId, submissionType, category) {
    	await connect();
    	const submissionRepo = client.fetchRepository(submissionSchema);
    	const submissions = await submissionRepo
    		.search()
    		.where("userId")
    		.does.not.equal(excludeUserId)
    		.and("type")
    		.equals(submissionType)
    		.and("category")
    		.equals(category)
    		.return.all();
    	return submissions;
    }
    ```

  - ```javascript
    async function searchSubmissionsByFullText(excludeUserId, submissionType, query) {
    	await connect();
    	const submissionRepo = client.fetchRepository(submissionSchema);
    	const submissions = await submissionRepo
    		.search()
    		.where("userId")
    		.does.not.equal(excludeUserId)
    		.and("type")
    		.equals(submissionType)
    		.where("description")
    		.matches(query)
    		.return.all();
    	return submissions;
    }
    ```

## How to run it locally?

### Prerequisites

- Node v16.13.2
- NPM v8.4.1
- Docker v20.10.17
- Create a free mapbox account and create access token from the dashboard page. [mapbox help](https://docs.mapbox.com/help/)

### Local installation

- For Redis Stack on Docker

  - Follow instruction from [Run Redis Stack on Docker](https://redis.io/docs/stack/get-started/install/docker/)

- For server (lost-to-found-api)

  - Install all npm dependencies with cmd on project root `npm install`

  - Create a `.env` file with following entries on project root

    ```
    PORT=5000
    REDIS_URL=redis://localhost:6379
    SESSION_SECRET=secret
    JWT_SECRET=<YOUR_JWT_SECRET>
    ```

  - open cmd on project root and run cmd `npm run server`
  - server should be running in localhost at port 5000

- For client (lost--to--found)

  - Install all npm dependencies with cmd on project root `npm install`

  - Create a `.env.local` file with following entries on project root

    ```
    NEXT_PUBLIC_API_URL=http://localhost:5000/api
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=<YOUR_MAPBOX_ACCESS_TOKEN>
    ```

  - open cmd on project root and run cmd `npm run dev`

  - server should be running in localhost at port 3000
