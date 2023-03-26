package com.buttpirate.museum.backend.filter;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Pagination {
    private int page;
    private int total;
}
