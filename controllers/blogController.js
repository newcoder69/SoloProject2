import blogModel from "../models/blogModel.js";

//get all blogs
export async function getAllBlogs(req,res){
    try{
        const Blogs = await blogModel.find()
        res.json(Blogs);
    }catch(error){
        res.status(500).json({error: error.message})
    }
}



//get blog by ID
export async function getBlogByID(req,res){
    try{
        const blog = await blogModel.findById(req.params.id);
        if(!blog){
            return res.status(404).json({message: "Blog Not Found"})
        }
        res.json(blog);
    }catch{
        res.status(500).json({error: error.message});
    }
}



//create new blog post
export async function createBlogPost(req,res){
    try{
        const{title, content, author} = req.body;
        const newBlog = new blogModel({
            title,
            content,
            author,
            createdAt: new Date(),
            comments: [],
            likes:0
        });
        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    }catch(error){
        res.status(400).json({error: error.message});
    }
}

//like a blog post
export async function likeBlogPost(req,res){
    try{
        const blog = await blogModel.findById(req.params.id);
        if(!blog){
            return res.status(404).json({message: "Blog Not Found"})
        }
        blog.likes++;
        const updatedBlog = await blog.save();
        res.json(updatedBlog);
    }catch(error){
        res.status(500).json({error: error.message});
    }
}


//create a blog comment
export async function createBlogComment(req,res){
   
        try{
            const {userId,content } = req.body;
            const blog = await blogModel.findById(req.params.id);
            if(!blog){
                return res.status(404).json({message: "Blog Not Found"})
            }
            const newComment ={
                user: userId,
                content,
                likes:0
            };
            blog.comments.push(newComment);
            const updatedBlog = await blog.save();
            res.json(updatedBlog);
        }catch(error){
            res.status(500).json({error: error.message});
        }
    }


//like blog comments
export async function likeBlogComment(req,res){
   
    try{
        
        const blog = await blogModel.findById(req.params.id);
        if(!blog){
            return res.status(404).json({message: "Blog Not Found"})
        }
        const commentIndex = parseInt(req.params.commentIndex);
        if(isNaN(commentIndex) || commentIndex < 0 || commentIndex >= blog.comments.length){
            return res.status(404).json({message: "invalid comment index"})
        }
        const comment = blog.comments[commentIndex];
        comment.likes++;
        const updatedBlog = await blog.save();
        res.json(updatedBlog);
    }catch(error){
        res.status(500).json({error: error.message});
    }
}




//delete a blog post

export async function deleteBlogPost(req,res){
    try{
        const blog = await blogModel.findByIdAndDelete(req.params.id);
        if(!blog){
            return res.status(404).json({message: "Blog not found"})
        }
        res.json(blog);
    }catch(error){
        res.status(500).json({error:error.message});
    }
}


