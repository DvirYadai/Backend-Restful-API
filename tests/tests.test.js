const request = require("supertest");
const fs = require("fs");
const app = require("../app");

afterAll(() => {
  const files = fs.readdirSync("./tasks");
  for (const file of files) {
    if (
      file !== "90e3c244-ab87-4295-8c55-352f1d4f44ad.json" &&
      file !== "c84bd507-ef3f-4130-afad-5312bd96191f.json"
    ) {
      fs.unlinkSync(`./tasks/${file}`);
    }
  }
  fs.writeFileSync(`./tasks/deleteTest.json`, "");
});

// Get tests
describe("GET route", () => {
  const expectedTask = {
    priority: "4",
    date: "2021-02-18 17:12:19",
    text: "sdf",
    isDone: false,
    id: "c84bd507-ef3f-4130-afad-5312bd96191f",
  };

  const expectedErrorInvalid = "Invalid Bin Id provided";
  const expectedErrorCannotFind = "Cannot find Bin ID";

  it("Should return a task by a given id", async () => {
    const response = await request(app).get(`/b/${expectedTask.id}`);

    // Is the status code 200
    expect(response.status).toBe(200);

    // Is the body equal expectedTask
    expect(response.body).toEqual(expectedTask);
  });

  it("Should return an error when invalid bin id provided", async () => {
    const response = await request(app).get(`/b/@#eg45`);

    // Is the status code 400
    expect(response.status).toBe(400);

    // Is the body equal expectedError
    expect(response.text).toBe(expectedErrorInvalid);
  });

  it("Should return an error when cannot find Bin ID", async () => {
    const response = await request(app).get(
      `/b/9459647-0ccb-4fc4-3e9-a9ddf9866d7`
    );

    // Is the status code 404
    expect(response.status).toBe(404);

    // Is the body equal expectedError
    expect(response.text).toBe(expectedErrorCannotFind);
  });
});

// Post tests
describe("POST routes", () => {
  const taskToPost = {
    priority: "4",
    date: "2021-02-18 17:12:19",
    text: "sdf",
    isDone: false,
  };
  const expectedResponse = {
    priority: "4",
    date: "2021-02-18 17:12:19",
    text: "sdf",
    isDone: false,
  };

  const emptyTasksToPost = {};
  const expectedError = "Bin can not be blank";

  it("Should post a new task successfully", async () => {
    const response = await request(app).post(`/b`).send(taskToPost);

    // Is the status code 200
    expect(response.status).toBe(200);

    // Is the body equal expectedResponse
    expectedResponse.id = response.body.id;
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should return an error if tasks was empty", async () => {
    const response = await request(app).post(`/b`).send(emptyTasksToPost);

    // Is the status code 400
    expect(response.status).toBe(400);

    // Is the body equal expectedError
    expect(response.text).toEqual(expectedError);
  });
});

// Put tests
describe("PUT route", () => {
  const taskToUpdate = {
    priority: "4",
    date: "2021-02-18 17:12:19",
    text: "sdf",
  };

  const expectedErrorInvalid = "Invalid Bin Id provided";
  const expectedErrorCannotFind = "Bin Id not found";

  const filesBeforeUpdating = fs.readdirSync("./tasks").length;

  it("Should update task with a given Bin ID successfully", async () => {
    const response = await request(app)
      .put(`/b/90e3c244-ab87-4295-8c55-352f1d4f44ad`)
      .send(taskToUpdate);

    // Is the status code 200
    expect(response.status).toBe(200);

    // Is the body equal taskToUpdate
    taskToUpdate.id = response.body.id;
    expect(response.body).toEqual(taskToUpdate);

    //
    const filesAfterUpdating = fs.readdirSync("./tasks").length - 1;
    expect(filesAfterUpdating).toBe(filesBeforeUpdating);
  });

  it("Should return an error when invalid bin id provided", async () => {
    const response = await request(app).put(`/b/@#eg45`).send(taskToUpdate);

    // Is the status code 400
    expect(response.status).toBe(400);

    // Is the body equal expectedErrorInvalid
    expect(response.text).toBe(expectedErrorInvalid);
  });

  it("Should return an error when cannot find Bin ID", async () => {
    const response = await request(app)
      .put(`/b/112443b-d4e0-484-ad78-c0016f19ce3`)
      .send(taskToUpdate);

    // Is the status code 404
    expect(response.status).toBe(404);

    // Is the body equal expectedErrorCannotFind
    expect(response.text).toBe(expectedErrorCannotFind);
  });
});

// Delete tests
describe("Delete tests", () => {
  const expectedSuccessMessage = "Success";
  const expectedErrorInvalid = "Invalid Bin Id provided";
  const expectedErrorCannotFind = "Bin Id not found";

  it("Should delete task by given Bin Id", async () => {
    const response = await request(app).delete(`/b/deleteTest`);

    // Is the status code 200
    expect(response.status).toBe(200);

    // Is the body equal expectedSuccessMessage
    expect(response.text).toBe(expectedSuccessMessage);
  });

  it("Should return an error when invalid bin id provided", async () => {
    const response = await request(app).delete(`/b/@#eg45`);

    // Is the status code 400
    expect(response.status).toBe(400);

    // Is the body equal expectedErrorInvalid
    expect(response.text).toBe(expectedErrorInvalid);
  });

  it("Should return an error when cannot find Bin ID", async () => {
    const response = await request(app).delete(
      `/b/112443b-d4e0-484-ad78-c00119ce3`
    );

    // Is the status code 404
    expect(response.status).toBe(404);

    // Is the body equal expectedErrorCannotFind
    expect(response.text).toBe(expectedErrorCannotFind);
  });
});
