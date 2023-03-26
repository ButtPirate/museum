package com.buttpirate.museum.backend.model;

import com.buttpirate.museum.backend.DTO.ItemDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class Item extends AbstractModel {
    private String invNumber;
    private String name;
    private String circa;
    private String origin;
    private String placement;
    private String comment;

    public Item() {
    }

    public Item(ItemDTO dto) {
        if (dto.getId() != null) {
            this.setId(dto.getId());
        }

        this.invNumber = dto.getInvNumber();
        this.name = dto.getName();
        this.circa = dto.getCirca();
        this.origin = dto.getOrigin();
        this.placement = dto.getPlacement();
        this.comment = dto.getComment();
    }
}
