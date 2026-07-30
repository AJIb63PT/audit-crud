import { describe, it, expect } from "vitest";

function parseSearchParams(params: Record<string, unknown>) {
    return {
        page: params.page ? Number(params.page) : 1,
        perPage: params.per_page ? Number(params.per_page) : 10,
        cargoNum: params.cargo_num ? String(params.cargo_num) : "",
        status: params.status ? String(params.status) : "",
        loadCity: params.load_city ? String(params.load_city) : "",
        unloadCity: params.unload_city ? String(params.unload_city) : "",
        dateFrom: params.date_from ? String(params.date_from) : "",
        dateTo: params.date_to ? String(params.date_to) : "",
        isAvailable:
            params.is_available === true || params.is_available === "true",
        isBidder: params.is_bidder === true || params.is_bidder === "true",
        priceFrom: params.price_from ? Number(params.price_from) : null,
        priceTo: params.price_to ? Number(params.price_to) : null,
    };
}

describe("search-params", () => {
    it("parses page number", () => {
        const result = parseSearchParams({ page: "2" });
        expect(result.page).toBe(2);
    });

    it("defaults page to 1", () => {
        const result = parseSearchParams({});
        expect(result.page).toBe(1);
    });

    it("parses boolean checkboxes", () => {
        const t = parseSearchParams({ is_available: "true" });
        const f = parseSearchParams({ is_available: "false" });
        const none = parseSearchParams({});
        expect(t.isAvailable).toBe(true);
        expect(f.isAvailable).toBe(false);
        expect(none.isAvailable).toBe(false);
    });

    it("parses string filters", () => {
        const result = parseSearchParams({
            cargo_num: "CARGO-001",
            status: "Active",
        });
        expect(result.cargoNum).toBe("CARGO-001");
        expect(result.status).toBe("Active");
    });

    it("handles price ranges", () => {
        const withPrices = parseSearchParams({
            price_from: "1000",
            price_to: "5000",
        });
        const noPrices = parseSearchParams({});
        expect(withPrices.priceFrom).toBe(1000);
        expect(withPrices.priceTo).toBe(5000);
        expect(noPrices.priceFrom).toBeNull();
        expect(noPrices.priceTo).toBeNull();
    });
});
