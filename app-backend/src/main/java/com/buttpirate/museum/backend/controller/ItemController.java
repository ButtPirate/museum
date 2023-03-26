package com.buttpirate.museum.backend.controller;

import com.buttpirate.museum.backend.DTO.ItemDTO;
import com.buttpirate.museum.backend.dao.ItemDAO;
import com.buttpirate.museum.backend.filter.ComplexItemFilter;
import com.buttpirate.museum.backend.filter.Response;
import com.buttpirate.museum.backend.filter.SmartItemFilter;
import com.buttpirate.museum.backend.service.ItemService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/item")
public class ItemController {
    @Resource
    private ItemService itemService;
    @Resource
    private ItemDAO itemDAO;

    @GetMapping("/{id}")
    public ItemDTO get(@PathVariable long id) {
        return itemService.get(id);
    }

    @PostMapping
    public ItemDTO save(@Valid @RequestBody ItemDTO request) {
        ItemDTO savedItem = itemService.save(request);

        return savedItem;
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable long id) {
        itemService.delete(id);
    }

    @GetMapping("/search")
    public Response<ItemDTO> search(@RequestParam(required = false) Integer page,
                                @RequestParam(required = false) Integer pageSize,
                                @RequestParam(required = false) String name,
                                @RequestParam(required = false) String invNumber,
                                @RequestParam(required = false) String circa,
                                @RequestParam(required = false) String origin,
                                @RequestParam(required = false) String placement,
                                @RequestParam(required = false) String comment,
                                @RequestParam(required = false) String orderColumn
                                ) {
        ComplexItemFilter filter = new ComplexItemFilter(name, invNumber, circa, origin, placement, comment);
        if (page != null) { filter.setPage(page); }
        if (pageSize != null) { filter.setPageSize(pageSize); }
        filter.setOrderColumn(Objects.requireNonNullElse(orderColumn, "id"));

        if (!filter.validate()) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST); }

        return itemService.search(filter);
    }

    @GetMapping("/smart-search")
    public Response<ItemDTO> smartSearch(@RequestParam(required = false) Integer page,
                                         @RequestParam(required = false) Integer pageSize,
                                         @RequestParam(required = false) String query,
                                         @RequestParam(required = false) String orderColumn) {
        SmartItemFilter filter = new SmartItemFilter(query);

        if (page != null) { filter.setPage(page); }
        if (pageSize != null) { filter.setPageSize(pageSize); }
        filter.setOrderColumn(Objects.requireNonNullElse(orderColumn, "id"));

        if (!filter.validate()) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST); }

        return itemService.smartSearch(filter);
    }

    @GetMapping("/tooltip")
    public List<String> fieldTooltip(@RequestParam String fieldName, @RequestParam(required = false) String query) {
        return itemDAO.fieldTooltip(fieldName, query);
    }

}
