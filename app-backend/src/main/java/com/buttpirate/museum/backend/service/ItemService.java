package com.buttpirate.museum.backend.service;

import com.buttpirate.museum.backend.DTO.ItemDTO;
import com.buttpirate.museum.backend.dao.ItemDAO;
import com.buttpirate.museum.backend.filter.ComplexItemFilter;
import com.buttpirate.museum.backend.filter.Response;
import com.buttpirate.museum.backend.filter.SearchResult;
import com.buttpirate.museum.backend.filter.SmartItemFilter;
import com.buttpirate.museum.backend.model.Item;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.annotation.Resource;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class ItemService {
    @Resource
    private ItemDAO itemDAO;

    public ItemDTO save(ItemDTO dto) {
        Item model = this.toModel(dto);

        if (dto.getId() != null) {
            if (!itemDAO.exists(dto.getId())) { throw new ResponseStatusException(NOT_FOUND, "Item with id {"+dto.getId()+"} not found"); }

            itemDAO.update(model);
        } else {
            itemDAO.insert(model);
        }

        return this.get(model.getId());

    }

    public ItemDTO get(long id) {
        if (!itemDAO.exists(id)) { throw new ResponseStatusException(NOT_FOUND, "Item with id {"+id+"} not found"); }

        Item model = itemDAO.get(id);
        return this.toDTO(model);
    }

    public void delete(long id) {
        if (!itemDAO.exists(id)) { throw new ResponseStatusException(NOT_FOUND, "Item with id {"+id+"} not found"); }

        itemDAO.delete(id);
    }

    public Response<ItemDTO> search(ComplexItemFilter filter) {
        SearchResult<Item> searchResult = itemDAO.search(filter);

        return map(searchResult);
    }

    private Response<ItemDTO> map(SearchResult<Item> searchResult) {
        List<ItemDTO> mappedDTOs = searchResult.getItems().stream().map( (model) -> { return new ItemDTO(model); } ).collect(Collectors.toList());

        return new Response<>(mappedDTOs, searchResult.getPagination());
    }

    private ItemDTO toDTO(Item model) { return new ItemDTO(model); }

    private Item toModel(ItemDTO dto) {
        return new Item(dto);
    }

    public Response<ItemDTO> smartSearch(SmartItemFilter filter) {
        SearchResult<Item> searchResult = itemDAO.smartSearch(filter);

        return map(searchResult);

    }
}
