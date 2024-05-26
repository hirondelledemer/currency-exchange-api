import chai, { expect } from "chai";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import chaiHttp from "chai-http";
import app from "../server";

chai.use(chaiHttp);

const mock = new MockAdapter(axios);

describe("/quote", () => {
  describe("errors", () => {
    it('should return "missing params" error', (done) => {
      chai
        .request(app)
        .get("/quote")
        .end((_err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.deep.equal({
            error: "Missing required query parameters",
          });

          done();
        });
    });

    it('should return "unsupported currency" error', (done) => {
      chai
        .request(app)
        .get("/quote?quoteCurrency=random&baseCurrency=EUR&baseAmount=1000")
        .end((_err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.deep.equal({ error: "Unsupported currency" });
          done();
        });
    });

    it("should return server error", (done) => {
      mock.onGet("https://api.exchangerate-api.com/v4/latest/EUR").reply(400);

      chai
        .request(app)
        .get("/quote?quoteCurrency=USD&baseCurrency=EUR&baseAmount=1000")
        .end((_err, res) => {
          expect(res.statusCode).to.equal(500);
          expect(res.body).to.deep.equal({
            error: "Internal server error",
          });
          done();
        });
    });
  });

  it("should return exchange rate", (done) => {
    mock.onGet("https://api.exchangerate-api.com/v4/latest/EUR").reply(200, {
      rates: {
        USD: 3,
      },
    });

    chai
      .request(app)
      .get("/quote?quoteCurrency=USD&baseCurrency=EUR&baseAmount=1000")
      .end((_err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.deep.equal({
          exchangeRate: 3,
          quoteAmount: 3000,
        });
        done();
      });
  });
});
