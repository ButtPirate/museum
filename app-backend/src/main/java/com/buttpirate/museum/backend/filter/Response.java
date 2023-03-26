package com.buttpirate.museum.backend.filter;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Collections;
import java.util.List;

@Data
@AllArgsConstructor
public class Response<T> {
    List<T> items = Collections.emptyList();
    Pagination pagination;

}
