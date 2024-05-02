


let loggedIn = false;
let userId;




window.addEventListener('DOMContentLoaded', async () =>{
    await fetchAndDisplayBlogPosts();
})


async function fetchAndDisplayBlogPosts(){
    try{
        const blogPostResponse = await fetch('/blogs/');
        if(!blogPostResponse.ok){
            throw new Error('Failed to fetch blog posts');
        }
        const blogPosts = await blogPostResponse.json();
        
        await Promise.all(blogPosts.map(async (blogPost) =>{
            const authorResponse = await fetch(`/users/${blogPost.author}`);
            if(!authorResponse.ok){
                throw new Error('Failed to fetch author details');
            }

            const authData = await authorResponse.json();
            blogPost.authorName = authData.name;


        }));
        await Promise.all(blogPosts.map(async (blogpost) => {
            await Promise.all(blogPost.comments.map(async (comment) => {
                const userResponse = await fetch(`/users/${comment.user}`);
                if(!userResponse.ok){
                    throw new Error('Failed to fetch user details')
                }
                const userData = await userResponse.json();
                comment.userName = userData.name;
            }));
        }));

        await displayBlogPost(blogPosts);
    }catch(error){
        console.error('Error fetching content', error.message);
    }
}


async function displayBlogPost(blogPosts){
    const blogPostContainer = document.getElementById('blogPosts');
    blogPostContainer.innerHTML = '';

    blogPosts.forEach(blogPost =>{
        const cardElement = createBlogPostCard(blogPost);
        blogPostContainer.appendChild(cardElement);
    })
}

function createBlogPostCard(blogPost){
    const cardElement = document.createElement('div');
    cardElement.classList.add('blog-post-card')

    const titleElement = document.createElement('h5');
    titleElement.textContent = blogPost.title;

    const authorElement = document.createElement('p');
    authorElement.textContent = `Author: ${blogpost.authorName}`;

    const contentElement = document.createElement('p');
    contentElement.textContent = blogPost.content;

    const postLikesButton = createLikeButton(blogPost.likes);

    postLikesButton.addEventListener('click', async () => {
        if(blogPost.liked || !loggedIn){
            return
        }

        try{
            const response = await fetch(`/blogs/like/${blogPost._id}`, {
                method:'PUT',
                headers:{
                    'Content-Type':'application/json'
                } 
            });
            if(!response.ok){
                throw new Error('Failed to load blog post. Please Try Again.');

            }

            blogPost.likes++
            postLikesButton.querySelector('.likes-count').textContent = `${blogPost.likes}`;
            blogPost.liked = true;
        }catch (error){
            console.log('Error ',error.message);
        }
    });

    const commentsElement = createCommentElement(blogPost);

    cardElement.appendChild(titleElement);
    cardElement.appendChild(authorElement);
    cardElement.appendChild(postLikesButton);   
    cardElement.appendChild(contentElement);
    cardElement.appendChild(commentsElement);

    if(loggedIn){
        const commentForm = createCommentForm(blogPost._id);
        cardElement.appendChild(commentForm);

    }
    


    return cardElement;
}

document.getElementById('loginForm').addEventListener('submit', async (event) =>{
    event.preventDefault();
    const formData = new FormData(event.target);
    console.log(formData.get('username'));  
    const username = formData.get('username');
    const password = formData.get('password');

    try{
        const response = await fetch('/users/login',{
            method:'POST',  
                headers: {    
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username,password})
        });
        if(!response.ok){
            throw new Error('Could Not log in. Try Again');

        }
        const data = await response.json();
        userId = data._id;
        loggedIn = true;

        console.log('Login successful',data);

        document.getElementById('loginFormContainer').style.display = 'none';
        document.getElementById('blogFormContainer').style.display = 'block';

        document.getElementById('userGreeting').innerHTML = `<h4>Hello, ${data.name}<h4>`;
        await fetchAndDisplayBlogPosts();
    }catch(error){
        console.error('Error: ', "could not log in");
        document.getElementById('validation').innerHTML = `<p>${error.message}<p>`
    } finally {
        event.target.reset();
    }

}); 

document.getElementById('blogForm').addEventListener('submit', async (event) =>{
    event.preventDefault();
    const formData = new FormData(event.target);
    const title = formData.get('postTitle');
    const content = formData.get('postContent');

    try{
        const response = await fetch('/blogs/',{
            method:'POST',  
                headers: {    
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({title,content,author:userId})
        });
        if(!response.ok){
            throw new Error('Could Not log in. Try Again');

        }
        const data = await response.json();
        

        console.log('Login Successful:',data);
        document.getElementById('userGreeting').innerHTML = `<h4>Hello, ${data.name} <h4>`


    }catch(error){
        console.error('Error: ', "Could not log in");
        document.getElementById('validation').innerHTML = `<p>${error.message}<p>`
    } finally {
        event.target.reset();
    }

}); 

function createLikeButton(likes) {
    const likeButton = document.createElement('button');
    likeButton.classList.add('likes-button')
     
    const heartIcon = document.createElement('img');
    heartIcon.classList.add('heart-icon');
    heartIcon.src = 'resources/like.png';
    heartIcon.alt = 'Like';

    const likeCount = document.createElement('span');
    likeCount.textContent = `${likes}`;
    likeCount.classList.add('likes-count');

    likeButton.appendChild(heartIcon);
    likeButton.appendChild(likeCount);

    return likeButton;



}

function createCommentElement(blogPost){
    const commentsElement = document.createElement('ul');
    commentsElement.classList.add('comment')

    blogPost.comments.forEach((comment,index) => {
        const commentItem = document.createElement('li');

        const userIcon = document.createElement('img');
        userIcon.classList.add('heart-icon');
        userIcon.src = 'resources/user.png';
        userIcon.alt = 'user';

        const commentContent = document.createElement('span');
        commentContent.textContent = `${comment.userName} : ${comment.content}`;
        const commentLikeButton = createLikeButton(comment.likes);

        commentItem.appendChild(userIcon);
        commentItem.appendChild(commentContent);
        commentItem.appendChild(commentLikeButton);
        commentsElement.appendChild(commentItem);
        postLikesButton.addEventListener('click', async () => {
            if(commentt.liked || !loggedIn){
                return
            }
    
            try{
                const response = await fetch(`/blogs/like/${blogPost._id}/comment/like/${index}`, {
                    method:'PUT',
                    headers:{
                        'Content-Type':'application/json'
                    } 
                });
                if(!response.ok){
                    throw new Error('Failed to load blog post. Please Try Again.');
    
                }
    
                blogPost.likes++
                postLikesButton.querySelector('.likes-count').textContent = `${blogPost.likes}`;
                blogPost.liked = true;
            }catch (error){
                console.log('Error ',error.message);
            }
        });



    });
    return commentsElement; 
}

function createCommentForm(blogPost){
    const commentForm = document.createElement('form');
    commentForm.classList.add('comment-form');

    const commentTextArea = document.createElement('textarea');
    commentTextArea.setAttribute('placeholder', 'Write your comment here...');
    commentTextArea.setAttribute('name', 'comment');
    commentTextArea.classList.add('form-control', 'mb-2');
    commentForm.appendChild(commentTextArea); 

    const submitButton = document.createElement('button');
    submitButton.setAttribute('type','submit');
    submitButton.textContent('submit');
    submitButton.classList.add('btn','btn-primary');
    commentForm.appendChild(submitButton);

    commentForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        if(!loggedIn){
            console.log('Please log in to submit a comment');
            return
        }
        const formData = new FormData(commentForm);
        const commentContent = formData.get('comment');

        try{
            const response = await fetch(`/blogs/${blogPostId}/comment`,{
                method: 'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({content: commentContent,userId:userId})

            }); 

            if(!response.ok){
                throw new Error('Failed to add comment, please try again');
            }
            commentForm.reset();
            console.log("comment added successfully!");
            const updatedBlogPosts = await fetch(`/blogs/${blogPostId}`);
            const updatedBlogPost = await updatedBlogPosts.json();
            await fetchAndDisplayBlogPosts

        }catch (error){
            console.error('Error',error.message);
        }

    });

    return commentForm;

}