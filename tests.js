const request = require("supertest");
const app = require("./server");

describe("POST /api/cases/create", () => {
  it("should return 400 if case_ad_id is not an integer", async () => {
    const res = await request(app)
      .post("/api/cases/create")
      .send({
        case_ad_id: "not an integer",
        case_due_date: "2022-12-31",
        case_type: "some type",
        case_notes: "some notes",
      });
    expect(res.statusCode).toEqual(400);
  });

  it("should return 400 if case_due_date is not in ISO8601 format", async () => {
    const res = await request(app)
      .post("/api/cases/create")
      .send({
        case_ad_id: 123,
        case_due_date: "not ISO8601",
        case_type: "some type",
        case_notes: "some notes",
      });
    expect(res.statusCode).toEqual(400);
  });

  it("should return 400 if case_due_date is in the past", async () => {
    const res = await request(app)
      .post("/api/cases/create")
      .send({
        case_ad_id: 123,
        case_due_date: "2020-01-01",
        case_type: "some type",
        case_notes: "some notes",
      });
    expect(res.statusCode).toEqual(400);
  });

  it("should return 400 if case_type is not a string", async () => {
    const res = await request(app)
      .post("/api/cases/create")
      .send({
        case_ad_id: 123,
        case_due_date: "2022-12-31",
        case_type: 123,
        case_notes: "some notes",
      });
    expect(res.statusCode).toEqual(400);
  });

  it("should return 400 if case_notes is not a string", async () => {
    const res = await request(app)
      .post("/api/cases/create")
      .send({
        case_ad_id: 123,
        case_due_date: "2022-12-31",
        case_type: "some type",
        case_notes: 123,
      });
    expect(res.statusCode).toEqual(400);
  });

  it("should return 200 if request is valid", async () => {
    const res = await request(app)
      .post("/api/cases/create")
      .send({
        case_ad_id: 123,
        case_due_date: "2022-12-31",
        case_type: "some type",
        case_notes: "some notes",
      });
    expect(res.statusCode).toEqual(200);
  });
});const request = require("supertest");
const app = require("./server");

describe("GET /api/bids/paraplanner/:id", () => {
  it("should return 400 if ID is empty", async () => {
    const res = await request(app).get("/api/bids/paraplanner/");
    expect(res.statusCode).toEqual(400);
  });

  it("should return 400 if ID is not a number", async () => {
    const res = await request(app).get("/api/bids/paraplanner/abc");
    expect(res.statusCode).toEqual(400);
  });

  it("should return 200 if ID is valid", async () => {
    const res = await request(app).get("/api/bids/paraplanner/1");
    expect(res.statusCode).toEqual(200);
  });
});

describe("POST /api/advisers/create", () => {
  it("should return 400 if required fields are missing", async () => {
    const res = await request(app).post("/api/advisers/create").send({});
    expect(res.statusCode).toEqual(400);
  });

  it("should return 400 if email is invalid", async () => {
    const res = await request(app)
      .post("/api/advisers/create")
      .send({ ad_email: "invalid-email" });
    expect(res.statusCode).toEqual(400);
  });

  it("should return 200 if all fields are valid", async () => {
    const res = await request(app)
      .post("/api/advisers/create")
      .send({
        ad_firstname: "John",
        ad_lastname: "Doe",
        ad_email: "johndoe@example.com",
        ad_role: "Financial Advisor",
        ad_tel: "1234567890",
      });
    expect(res.statusCode).toEqual(200);
  });
});

describe("PUT /api/advisers/update/:id", () => {
  it("should return 400 if ID is not a number", async () => {
    const res = await request(app).put("/api/advisers/update/abc");
    expect(res.statusCode).toEqual(400);
  });

  it("should return 400 if email is invalid", async () => {
    const res = await request(app)
      .put("/api/advisers/update/1")
      .send({ ad_email: "invalid-email" });
    expect(res.statusCode).toEqual(400);
  });

  it("should return 200 if all fields are valid", async () => {
    const res = await request(app)
      .put("/api/advisers/update/1")
      .send({
        ad_firstname: "John",
        ad_lastname: "Doe",
        ad_email: "johndoe@example.com",
        ad_role: "Financial Advisor",
        ad_tel: "1234567890",
      });
    expect(res.statusCode).toEqual(200);
  });
});

describe("DELETE /api/advisers/delete/:id", () => {
  it("should return 400 if ID is not a number", async () => {
    const res = await request(app).delete("/api/advisers/delete/abc");
    expect(res.statusCode).toEqual(400);
  });

  it("should return 400 if adviser has associated cases", async () => {
    const res = await request(app).delete("/api/advisers/delete/1");
    expect(res.statusCode).toEqual(400);
  });

  it("should return 200 if adviser is deleted successfully", async () => {
    const res = await request(app).delete("/api/advisers/delete/2");
    expect(res.statusCode).toEqual(200);
  });
});