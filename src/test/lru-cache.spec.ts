import sinon from "sinon";
import { LRUCache } from "../lru-cache";
import { expect } from "chai";

describe("LRUCache", () => {
  it("should store and retrieve a value", () => {
    const cache = new LRUCache<string, number>(2);
    cache.put("item1", 1);
    expect(cache.get("item1")).to.equal(1);
  });

  it("should remove the oldest item when capacity is exceeded", () => {
    const cache = new LRUCache<string, number>(2);
    cache.put("item1", 1);
    cache.put("item2", 2);
    cache.put("item3", 3);
    expect(cache.get("item1")).to.be.undefined;
    expect(cache.get("item2")).to.equal(2);
    expect(cache.get("item3")).to.equal(3);
  });

  it("should update the timestamp of a recently accessed item", () => {
    const cache = new LRUCache<string, number>(2);
    cache.put("item1", 1);
    cache.put("item2", 2);
    cache.get("item1");
    cache.put("item3", 3);
    expect(cache.get("item2")).to.be.undefined;
    expect(cache.get("item1")).to.equal(1);
    expect(cache.get("item3")).to.equal(3);
  });

  it("should return undefined for non-existent keys", () => {
    const cache = new LRUCache<string, number>(2);
    expect(cache.get("random")).to.be.undefined;
  });

  it("should correctly validate item freshness with timeout", () => {
    const clock = sinon.useFakeTimers();
    const cache = new LRUCache<string, number>(2);
    const timeout = 1000; // 1 second
    cache.put("item1", 1);
    expect(cache.isValid("item1", timeout)).to.be.true;

    clock.tick(1500);
    expect(cache.isValid("item1", timeout)).to.be.false;
  });

  it("should return the correct value after updating an existing key", () => {
    const cache = new LRUCache<string, number>(2);
    cache.put("item1", 1);
    expect(cache.get("item1")).to.equal(1);

    cache.put("item1", 2);
    expect(cache.get("item1")).to.equal(2);
  });
});
