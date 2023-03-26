package com.buttpirate.museum.backend.DTO;

import com.buttpirate.museum.backend.model.Item;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class ItemDTO {
    private Long id;
    private String invNumber;
    @NotBlank
    private String name;
    private String circa;
    private String origin;
    private String placement;
    private String comment;

    public ItemDTO() {
    }

    public ItemDTO(Item model) {
        this.id = model.getId();
        this.invNumber = model.getInvNumber();
        this.name = model.getName();
        this.circa = model.getCirca();
        this.origin = model.getOrigin();
        this.placement = model.getPlacement();
        this.comment = model.getComment();
    }
}
