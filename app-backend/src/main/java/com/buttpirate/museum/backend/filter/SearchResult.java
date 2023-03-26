package com.buttpirate.museum.backend.filter;

import com.buttpirate.museum.backend.model.AbstractModel;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class SearchResult<T extends AbstractModel> {
    private List<T> items;
    private Pagination pagination;
}
