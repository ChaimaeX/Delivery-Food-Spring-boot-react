import { Divider, FormControl, FormControlLabel, Grid, MenuItem, Radio, RadioGroup, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MenuCard from './MenuCard';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRestaurantById, getRestaurantCategoory } from '../State/Restaurant/Action';
import { getMenuItemsByResturantId, searchMenuItem } from '../State/Menu/Action';

const categories=[
    "pizza",
    "burger",
    "chiken",
    "rice",
]

const menu =[1,1,1,1,1,1,1]

const foodTypes=[
    {label:"All" , value:"all"},
    {label:"Vegetarian only" , value:"vegetarian"},
    {label:"Non-Vegetarian" , value:"non_Vegetarien"},
    {label:"Seasonal" , value:"seasonal"},

]
export const RestaurantDetails = () => {
    const[foodType,setFoodType] = useState("all")
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const jwt=localStorage.getItem("jwt")

    const {id,city}=useParams();
    const {auth,restaurant,menu} =useSelector(store=>store)
    const[selectedCategory,setSelectedCategory]=useState("")

    useEffect(() => {
      const fetchRestaurantData = async () => {
        try {
          setLoading(true);
          dispatch(getMenuItemsByResturantId(
                {
                  restaurantId:restaurant.usersRestaurant.id,
                  jwt:localStorage.getItem("jwt"),
                  vegetarian:false,
                  seasonal:false,
                  nonveg:false,
                  foodCategory:""
                }
          ))
          dispatch(getRestaurantById({ jwt, restaurantId: id }));
          dispatch(getRestaurantCategoory({jwt, restaurantId: id}));
         
          //get the category with id not jwt of th owner
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
    
      fetchRestaurantData();
    }, []);

    useEffect(()=>{
      dispatch(
        getMenuItemsByResturantId(
          {jwt,
          vegetarian:foodType==="vegetarian",
          nonveg:foodType==="non_Vegetarien",
          seasonal:
          foodType==="seasonal",
          restaurantId:id,
          foodCategory:selectedCategory
          })
      )
    },[foodType])
 

    const handleFilter=(e)=>{
      setFoodType(e.target.value)
    }
    const handleFilterCategory=(e,value)=>{
        setSelectedCategory(e.target.value)
        dispatch(searchMenuItem({keyword:e.target.value,jwt}))

        
    }
    console.log("restaurant:",restaurant);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
   
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
  return (
     <div className='px-5 lg:px-20'>
        <section>
            <h3 className='text-gray-500 py-2 mt-10'>Home/maroc/marocain fast food/3</h3>
            <div>
                <Grid container spacing={2}>
                   <Grid item xs={12}>
                    <img className='w-full h-[40vh] object-cover' 
                    src={restaurant.restaurant.images[0]} alt="" />
                    </Grid> 
                
                   <Grid item xs={12} lg={6}>
                    <img className='w-full h-[40vh] object-cover' 
                    src={restaurant.restaurant.images[1]} 
                     alt="" />
                    </Grid> 

                    <Grid item xs={12} lg={6}>
                    <img className='w-full h-[40vh] object-cover'
                     src={restaurant.restaurant.images[2]} 
                      alt="" />
                    </Grid> 
                </Grid>
            </div >

            <div className='pt-3 pb-5'>
                <h1 className='text-4xl font-semibold'>{restaurant.restaurant?.name}</h1>
                <p className='text-gray-500 mt-1'>
                  {restaurant.restaurant.description}
                </p>
            <div className='space-y-3 mt-3'>
                <p className='text-gray-500 flex items-center gap-3'>
                    <LocationOnIcon/>
                    <span> 
                        Meknes, morroc
                    </span>
                </p>

                <p className='text-gray-500 flex items-center gap-3'>
                    <CalendarTodayIcon/>
                    <span> {restaurant.restaurant.openinHours} (Today)</span>
                </p>

            </div>
            </div>
        </section>

        <section className='pt-[2rem] lg:flex relative'>
            <div className='space-y-10 lg:w-[20%] filter'>
                <div className='box space-y-5 lg:sticky top-28'>
                  <div>
                   <Typography variant="h5" sx={{paddingBotton:"1rem"}}>
                     Food Type
                   </Typography>

                   <FormControl className='py-10 space-y-5' component={"fiedset"}>
                     <RadioGroup  name='food_type' onClick={handleFilter} value={foodType}>
                       {foodTypes.map((item)=> <FormControlLabel 
                       key={item.value}
                       value={item.value} 
                       control={<Radio/>} 
                       label={item.label}/>)}
                     </RadioGroup>
                   </FormControl>
                  </div>
                  <Divider/>
                  <div>
                   <Typography variant="h5" sx={{paddingBotton:"1rem"}}>
                     Food Category
                   </Typography>
                   <FormControl className='py-10 space-y-5' component={"fiedset"}>
                     <RadioGroup onClick={handleFilterCategory} name='category_type' value={selectedCategory} >
                       {restaurant.categories.map((item)=> <FormControlLabel 
                       key={item.id}
                       value={item.name} 
                       control={<Radio/>} 
                       label={item.name}/>)}
                     </RadioGroup>
                   </FormControl>
                  </div>
                </div>
            </div>

            <div className='space-y-10 lg:w-[80%] lg:pl-10'>
                {
                    menu.menuItems.map((item)=> <MenuCard item={item}/>)
                }

            </div>

        </section>
     </div>
  )
}
