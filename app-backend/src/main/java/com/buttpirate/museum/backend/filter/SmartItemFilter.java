package com.buttpirate.museum.backend.filter;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static com.buttpirate.museum.backend.dao.AbstractDAO.sqlContainsText;

@Data
@AllArgsConstructor
public class SmartItemFilter extends AbstractFilter {
    private String query;

    private static List<String> validOrderColumns = new ArrayList<String>(List.of("id"));

    public Map<String, Object> constructParams() {
        Map<String, Object> params = super.constructParams();

        params.put("query", this.query);

        return params;
    }

    public String constructQuery() {
        String sql = "";

        if (this.query != null) {
            sql = "AND (\n";

            sql += sqlContainsText("query", "name") + "\n";
            sql += "OR " + sqlContainsText("query", "inv_number") + "\n";
            sql += "OR " + sqlContainsText("query", "circa") + "\n";
            sql += "OR " + sqlContainsText("query", "origin") + "\n";
            sql += "OR " + sqlContainsText("query", "placement") + "\n";
            sql += "OR " + sqlContainsText("query", "comment") + "\n";

            sql += ")";
        }

        return sql;
    }

    public boolean validate() {
        if (!super.validate()) {return false;}

        if (!SmartItemFilter.validOrderColumns.contains(this.getOrderColumn())) { return false; }

        return true;
    }
}
