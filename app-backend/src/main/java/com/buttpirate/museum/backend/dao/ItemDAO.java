package com.buttpirate.museum.backend.dao;

import com.buttpirate.museum.backend.filter.ComplexItemFilter;
import com.buttpirate.museum.backend.filter.SearchResult;
import com.buttpirate.museum.backend.filter.SmartItemFilter;
import com.buttpirate.museum.backend.model.Item;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;

@Repository
public class ItemDAO extends AbstractDAO {
    public ItemDAO(DataSource dataSource) {
        super(dataSource);
    }

    @Override
    public String getMainTableName() {
        return "items";
    }

    private static RowMapper<Item> ROW_MAPPER = new BeanPropertyRowMapper<>(Item.class);

    @Override
    public RowMapper<Item> getRowMapper() {
        return ROW_MAPPER;
    }

    public void insert(Item model) {
        String query = "" +
                "INSERT INTO items( \n" +
                "    id, \n" +
                "    inv_number,\n" +
                "    circa,\n" +
                "    origin,\n" +
                "    placement,\n" +
                "    name, \n" +
                "    comment \n" +
                ") VALUES ( \n" +
                "    NEXTVAL('items_seq'), \n" +
                "    :invNumber,\n" +
                "    :circa,\n" +
                "    :origin,\n" +
                "    :placement,\n" +
                "    :name, \n" +
                "    :comment \n" +
                ")";

        super.insert(query, model);
    }

    public void update(Item model) {
        String query = "" +
                "UPDATE items\n" +
                "SET inv_number = :invNumber,\n" +
                "    circa = :circa,\n" +
                "    origin = :origin,\n" +
                "    placement = :placement,\n" +
                "    name = :name,\n" +
                "    comment = :comment\n" +
                "WHERE id = :id";

        super.update(query, model);
    }

    public SearchResult<Item> search(ComplexItemFilter filter) {
        return super.search(filter, filter.constructQuery(), filter.constructParams());
    }

    public SearchResult<Item> smartSearch(SmartItemFilter filter) {
        return super.search(filter, filter.constructQuery(), filter.constructParams());
    }
}
