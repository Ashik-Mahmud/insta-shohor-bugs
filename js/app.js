let posts=[ ];

const likedPostsId = [];
const reportedPostsId = [];

const getLikedPosts = () => {
    return posts.filter((post) => likedPostsId.includes(post.id));
};

const getReportedPosts = () => {
    return posts.filter((post) => reportedPostsId.includes(post.id));
};

const isLiked = (id) => {
    return likedPostsId?.length && !!likedPostsId.includes(id);
};

const addToLiked = (event, id) => {
    likedPostsId.push(id); 
    event.querySelector('i').classList.add('text-danger')
};

const reportPost = (id) => {
    reportedPostsId.push(id);
    const remainingPosts = posts.filter((post) => !reportedPostsId.includes(post.id));
    showPosts(remainingPosts);
};

const displayContent = (image, text) => {
    return text.length < 30 ? text : text.slice(0, 30) + `<span onclick='showDetails("${image}", "${text}")' class='fw-bold cursor-pointer'>... read more</span>`;
};

/*  showing details  */
const canvasWrapper = document.getElementById("details-canvas");
const showDetails = (image, desc) =>{
    canvasWrapper.classList.add("active-canvas")
    document.querySelector(".description-wrapper").innerHTML = `
                    <img class="img-fluid" src="${image}"
                        alt="">
                    <div class="description">
                        ${desc}
                    </div>
                `;
}
document.addEventListener("click", (event)=>{
    if(event.target.id === 'details-canvas') canvasWrapper.classList.remove('active-canvas');
})

const switchTab = (id) => {
    if (id === "posts") {
        document.getElementById( "posts" ).style.display = "grid";
        document.getElementById( "liked" ).style.display = "none";
        document.getElementById( "reported" ).style.display = "none";
    } else if (id === "liked") {
        document.getElementById( "liked" ).style.display = "block";
        document.getElementById( "posts" ).style.display = "none";
        document.getElementById( "reported" ).style.display = "none";

        displayLikedPosts();
    } else {
        document.getElementById( "reported" ).style.display = "block";
        document.getElementById( "posts" ).style.display = "none";
        document.getElementById( "liked" ).style.display = "none";

        displayReportedPosts();
    }
};

const createPost = (post) => {
    const {image, userImage} = post;
    const div = document.createElement( "article" );
    div.classList.add( "post" );
    div.innerHTML = `
              <div class="post__header">
                <div class="post__profile">
                  <a
                    href="https://github.com/ProgrammingHero1"
                    target="_blank"
                    class="post__avatar"
                  >
                    <img src="${userImage}" alt="User Picture" />
                  </a>
                  <a href="#" class="post__user">phero</a>
                </div>

                <button class="post__more-options">
                  <i class="fa-solid fa-ellipsis"></i>
                </button>
              </div>

              <div class="post__content">
                <div class="post__medias">
                  <img
                    class="post__media"
                    src="${image}"
                    alt="Post Content"
                  />
                </div>
              </div>

              <div class="post__footer">
                <div class="post__buttons">
                  <button class="post__button" onclick="addToLiked(this, ${post.id})">
                  <i class="fa-solid fa-heart ${isLiked(post.id) && "text-danger"}"></i>
                    
                  </button>
                  <button class="post__button">
                    <i class="fa-solid fa-comment"></i>
                  </button>
                  

                  <div class="post__indicators"></div>

                  <button class="post__button post__button--align-right" onclick="reportPost(${
                      post.id
                  })">
                    <i class="fa-solid fa-ban"></i>
                  </button>
                </div>

                <div class="post__content">${displayContent(image, post.description)}</div>

                <div class="post__infos">
                  <div class="post__likes">
                    <a href="#" class="post__likes-avatar">
                      <img src="${userImage}" alt="User Picture" />
                    </a>

                    <span>Liked by
                      <a class="post__name--underline" href="#">user123</a> and
                      <a href="#">73 others</a></span>
                  </div>

                  <hr/>

                  <div class="post__description">
                    <small>
                      <a class="post__name--underline" href="#">
                          ${post.comments[0]?.user}
                      </a>
                      ${post.comments[0]?.text}
                    </small>
                  </div>
                  <span class="post__date-time">30 minutes ago</span>
                </div>
              </div>
      `;
    return div;
};

const showPosts = (posts) => {
    const productsContainer = document.getElementById( "posts" );
    productsContainer.innerHTML = "";

    posts.forEach((post) => {
        const div = createPost(post);
        productsContainer.appendChild(div);
    });
};

const displayLikedPosts = () => {
    document.getElementById( "liked-post" ).innerHTML = '';
    const likedPosts = getLikedPosts();
    if(likedPosts.length === 0){
        return document.getElementById( "liked-post" ).innerHTML = `<h3 class="text-center m-5 p-4 position-absolute text-muted">No Liked Post Available.</h3>`;
    }
    likedPosts.forEach((post) => {
        const div = createPost(post);
        document.getElementById("liked-post" ).appendChild(div);
    });
};

const displayReportedPosts = () => {
    document.getElementById( "reported-post" ).innerHTML = '';
    const reportedPosts = getReportedPosts();
    if(reportedPosts.length === 0){
        return document.getElementById( "reported-post" ).innerHTML = `<h3 class="text-center m-5 p-4 position-absolute text-muted">No Reported Post Available.</h3>`;
    }
    reportedPosts.forEach((post) => {
        const div = createPost(post);
        document.getElementById( "reported-post" ).appendChild(div);
    });
};

const loadPosts = async () =>{
  let data = await fetch('../data/posts.json');
  posts = await data.json();
  showPosts(posts);
}

loadPosts();