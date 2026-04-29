import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getCollapsedFilterCount, getFiltersFromForm, hasActiveFilters } from "./filterViewModel.js";

describe("filter view model", () => {
  it("counts only collapsed advanced filters", () => {
    const filters = {
      search: "vinicius",
      position: "Delantero",
      nationality: "",
      teamCountry: "España",
      minAge: "",
      maxAge: "30"
    };

    assert.equal(getCollapsedFilterCount(filters), 3);
    assert.equal(hasActiveFilters(filters), true);
  });

  it("adapts form values into filter input", () => {
    const form = documentLikeForm({
      search: "  fede  ",
      position: "Mediocampista central",
      nationality: "Uruguay",
      teamCountry: "España",
      minAge: "24",
      maxAge: "30"
    });

    assert.deepEqual(getFiltersFromForm(form, { limit: 20 }), {
      search: "fede",
      position: "Mediocampista central",
      nationality: "Uruguay",
      teamCountry: "España",
      minAge: "24",
      maxAge: "30",
      limit: 20
    });
  });
});

function documentLikeForm(values) {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => data.set(key, value));

  return data;
}
