
package com.delevery.deleveryspring.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.delevery.deleveryspring.Model.IngredientsCategory;
import com.delevery.deleveryspring.Model.IngredientsItem;
import com.delevery.deleveryspring.request.IngredientCategoryRequest;
import com.delevery.deleveryspring.request.IngredientRequest;
import com.delevery.deleveryspring.service.IngredientsService;



@RestController
@RequestMapping("/api/admin/ingredients")
public class IngredientsController {

    @Autowired
    private IngredientsService ingredientsService;


    @PostMapping("/category")
    public ResponseEntity<IngredientsCategory> createIngredientCategory(@RequestBody IngredientCategoryRequest req) throws Exception {
        IngredientsCategory item = ingredientsService.createIngredientsCategory(req.getName(), req.getRestaurantId());

        return new ResponseEntity<>(item,HttpStatus.CREATED);
    }


    @PostMapping()
    public ResponseEntity<IngredientsItem> createIngredientItem(@RequestBody IngredientRequest req)throws Exception{
        IngredientsItem item = ingredientsService.createIngredientsItem(req.getRestaurantId(), req.getName(),req.getCategoryId());

        return new ResponseEntity<>(item,HttpStatus.CREATED);
    }
    @PutMapping("/{id}/stock")
    public ResponseEntity<IngredientsItem> updateIngredientStock(@PathVariable Long id)throws Exception{
        IngredientsItem item = ingredientsService.updateStock(id);

        return new ResponseEntity<>(item,HttpStatus.OK);
    }
    
    @GetMapping("restaurant/{id}")
    public ResponseEntity<List<IngredientsItem>> getRestaurantIngredient(@PathVariable Long id)throws Exception{
        List<IngredientsItem> items = ingredientsService.findRestaurantsIngredients(id);

        return new ResponseEntity<>(items,HttpStatus.OK);
    }
    @GetMapping("restaurant/{id}/Category")
    public ResponseEntity<List<IngredientsCategory>> getRestaurantIngredientCategory(@PathVariable Long id)throws Exception{
        List<IngredientsCategory> items = ingredientsService.findIngredientsCategoryByRestaurantId(id);

        return new ResponseEntity<>(items, HttpStatus.OK);
    } 
    
}
