package com.buttpirate.museum.backend.filter;

import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public abstract class AbstractFilter {
    private int pageSize = 20;
    private int page = 1;
    private OrderDirection orderDirection = OrderDirection.DESC;
    private String orderColumn;

    public String offsetQueryPart() {
        String query = "\n";
        query += "LIMIT " + pageSize+ "\n"; // limit offset for H2, offset limit for psql
        query += "OFFSET " + ((this.page-1)*this.pageSize)+"\n";

        return query;
    }

    public String orderQueryPart() {
        String query = "\n";
        query += "ORDER BY "+orderColumn+" " + this.orderDirection.name() + " ";

        return query;
    }

    public boolean validate() {
        if (pageSize < 1) { return false; }
        if (pageSize > 1000) { return false; }
        if (page < 1) { return false; }
        if (page > 1000) { return false; }

        return true;
    }

    protected Map<String, Object> constructParams() {
        Map<String, Object> params = new HashMap<>();

        return params;
    }
}
