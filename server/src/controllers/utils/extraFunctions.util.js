import connection from "../../DB/db.js";

export const  toPascalCase = (str)=> {
    return str
        .toLowerCase()
        .split(/[^a-zA-Z0-9]+/) // Split by spaces, underscores, etc.
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '); // Join with spaces
}

export const editDate = (result)=>{
    for(let i = 0;i < result.length;i++){
        result[i].workout_date = result[i].workout_date.toLocaleDateString('en-CA').slice(0,10);
    }
    return result.reverse()
}