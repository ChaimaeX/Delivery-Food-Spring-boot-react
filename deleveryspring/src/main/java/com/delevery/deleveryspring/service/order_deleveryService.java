package com.delevery.deleveryspring.service;

import java.util.List;

import com.delevery.deleveryspring.Model.Delivery;


public interface order_deleveryService {

    public Delivery createOrder_Delevery(Long orderId,String jwt,boolean status) throws Exception ;

    public List<Delivery> getOrdersAccepted() throws Exception;

    public Delivery getOrderDeleveryById();

    public List<Delivery>  getAllOrderDelevery();

    
    
} 
