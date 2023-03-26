package com.buttpirate.museum.backend.filter;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static com.buttpirate.museum.backend.dao.AbstractDAO.sqlContainsText;

@Data
@AllArgsConstructor
public class ComplexItemFilter extends AbstractFilter {
    private String name;
    private String invNumber;
    private String circa;
    private String origin;
    private String placement;
    private String comment;

    private static List<String> validOrderColumns = new ArrayList<String>(List.of("id"));

    public Map<String, Object> constructParams() {
        Map<String, Object> params = super.constructParams();

        params.put("name", this.name);
        params.put("invNumber", this.invNumber);
        params.put("circa", this.circa);
        params.put("origin", this.origin);
        params.put("placement", this.placement);
        params.put("comment", this.comment);

        return params;
    }

    public String constructQuery() {
        String query = "";

        if (this.getName() != null) {
            query += "AND " + sqlContainsText("name", "name") + "\n";
        }

        if (this.getInvNumber() != null) {
            query += "AND " + sqlContainsText("invNumber", "inv_number") + "\n";
        }

        if (this.getCirca() != null) {
            query += "AND " + sqlContainsText("circa", "circa") + "\n";
        }

        if (this.getOrigin() != null) {
            query += "AND " + sqlContainsText("origin", "origin") + "\n";
        }

        if (this.getPlacement() != null) {
            query += "AND " + sqlContainsText("placement", "placement") + "\n";
        }

        if (this.getComment() != null) {
            query += "AND " + sqlContainsText("comment", "comment") + "\n";
        }

        return query;

    }

    public boolean validate() {
        if (!super.validate()) {return false;}

        if (!ComplexItemFilter.validOrderColumns.contains(this.getOrderColumn())) { return false; }

        return true;
    }
}
