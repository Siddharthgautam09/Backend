const asyncHandler = (requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch(next );
    }
}

export {asyncHandler}





// const asyncHandler = (fn) => async (req,res,error) => {
//     try {
//         await fn(req, res, error); 
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success:false,
//             message: error.message
//         })
//     }
// }
