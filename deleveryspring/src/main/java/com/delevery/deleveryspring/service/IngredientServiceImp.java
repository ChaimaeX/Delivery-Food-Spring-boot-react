package com.delevery.deleveryspring.service;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.delevery.deleveryspring.Model.IngredientsCategory;
import com.delevery.deleveryspring.Model.IngredientsItem;
import com.delevery.deleveryspring.Model.Restaurant;
import com.delevery.deleveryspring.reposetry.IngredientCategoryRepos;
import com.delevery.deleveryspring.reposetry.IngredientsItemRepos;

@Service
public class IngredientServiceImp implements IngredientsService{

    @Autowired
    private IngredientsItemRepos ingredientsItemRepos;

    @Autowired
    private IngredientCategoryRepos ingredientCategoryRepos;

    @Autowired
    private RestaurantService restaurantService; 


    @Override
    public IngredientsCategory createIngredientsCategory(String name, Long restaurantId) throws Exception {
        Restaurant restaurant = restaurantService.findRestaurantById(restaurantId); 

        IngredientsCategory category=new IngredientsCategory();

        category.setRestaurant(restaurant);
        category.setName(name);



        return ingredientCategoryRepos.save(category);
    }

    @Override
    public IngredientsCategory findIngredientsCategoryById(Long id) throws Exception {
        Optional<IngredientsCategory> opt = ingredientCategoryRepos.findById(id);
        if (opt.isEmpty()) {
            throw new Exception("ingredient category not found");

        }
        return opt.get();
    }

    @Override
    public List<IngredientsCategory> findIngredientsCategoryByRestaurantId(Long id) throws Exception {

       restaurantService.findRestaurantById(id);
       return ingredientCategoryRepos.findByRestaurantId(id);
    }

    @Override
    public IngredientsItem createIngredientsItem(Long restaurantId, String ingredientName, Long categoryId)
            throws Exception {

                IngredientsCategory category=findIngredientsCategoryById(categoryId);

                Restaurant restaurant = restaurantService.findRestaurantById(restaurantId);

                IngredientsItem item=new IngredientsItem();
                item.setName(ingredientName);
                item.setRestaurant(restaurant);
                item.setCategory(category);

                IngredientsItem Ingredient = ingredientsItemRepos.save(item);
                category.getIngredientsItem().add(Ingredient);
                return Ingredient;
    }

    @Override
    public List<IngredientsItem> findRestaurantsIngredients(Long restaurantId) {
       return ingredientsItemRepos.findByRestaurantId(restaurantId);
    }

    @Override
    public IngredientsItem updateStock(Long id) throws Exception {
       Optional<IngredientsItem> optionalIngredientsItem = ingredientsItemRepos.findById(id);

       if(optionalIngredientsItem.isEmpty()){
           throw new Exception("Ingredient not found");
       }
       IngredientsItem ingredentsItem=optionalIngredientsItem.get();

       ingredentsItem.setInStoke(!ingredentsItem.isInStoke());
        return ingredientsItemRepos.save(ingredentsItem);
    }
    
}
