var repos = null;
let perPage = 10;
let currPage = 1;
let totalRepos = 0;
let totalPages = 1;
let searchRepo;


function updatePagination() {
    const paginationContainer = $(".pages");
    const btnsContainer = $(".btns");
    paginationContainer.empty();
    btnsContainer.empty();

    const oldest = $(`<button class="btn2 ${currPage == 1 ? "disable" : ""}">← Oldest</button>`);
    const prevBtn = $(`<button class="page-btn ${currPage == 1 ? "disable" : ""}">«</button>`);
    if (currPage == 1) {
        prevBtn.attr("disabled", true);
        oldest.attr("disabled", true);
    }
    oldest.on("click", function () {
        currPage = 1;
        getRepoData(currPage);
        updatePagination(totalPages);
    })
    prevBtn.on("click", function () {
        currPage -= 1;
        getRepoData(currPage);
        updatePagination(totalPages);
    });
    paginationContainer.append(prevBtn);
    btnsContainer.append(oldest);

    for (let i = 1; i <= totalPages; i++) {
        const page = $(`<button class="page-btn">${i}</button>`);
        if (i === currPage) {
            page.addClass("active")
        }
        page.on("click", function () {
            currPage = i;
            getRepoData(currPage);
            updatePagination(totalPages);
        });
        paginationContainer.append(page);
    }

    const nextBtn = $(`<button class="page-btn ${currPage == totalPages ? "disable" : ""}">»</button>`);
    const newest = $(`<button class="btn2 ${currPage == totalPages ? "disable" : ""}">Newer→</button>`);
    if (currPage == totalPages) {
        nextBtn.attr("disabled", true);
        newest.attr("disabled", true);
    }
    newest.on("click", function () {
        currPage = totalPages;
        getRepoData(currPage);
        updatePagination(totalPages);
    })
    nextBtn.on("click", function () {
        currPage += 1;
        getRepoData(currPage);
        updatePagination(totalPages);
    });
    paginationContainer.append(nextBtn);
    btnsContainer.append(newest);
}

function handleFormSubmission(event) {
    event.preventDefault();
    currPage = 1;
    getRepoData();
}

function getRepoData(currPage) {
    $('.repos').empty();
    $('.error').hide();
    $(".loading").show();
    var username = $('#search').val();
    getUserInfo(username);
    perPage = $('#perpage').val();
    searchRepo = $('#custom').val();
    var API = `https://api.github.com/search/repositories?q=${searchRepo ? searchRepo : ""}+user:${username}&per_page=${perPage}&page=${currPage}`;
    $.ajax(
        {
            url: API,
            method: 'GET',
            success: function (data) {
                totalPages = Math.ceil(data.total_count / perPage);
                updatePagination();
                renderRepos(data.items);
                $(".loading").hide();
            },
            error: function (error) {
                console.log("Error while calling API");
                $(".loading").hide();
            }
        }
    );
};


function getUserInfo(username) {
    var API = `https://api.github.com/users/${username}`;
    $.ajax(
        {
            url: API,
            method: 'GET',
            success: function (data) {
                renderInfo(data);
                $(".info").show();
                $(".repo-link").show();
            },
            error: function (error) {
                console.log("Error while calling API");
                $('.repos').append(`<span class="error">Error while calling API</span>`)
            }
        }
    );
}

function renderInfo(data) {
    $('#profile').attr('src', data.avatar_url);
    $('#name').text(data.name);
    $('#bio').text(data.bio ? data.bio : "null");
    $('#location').text(data.location ? data.location : 'null');
    if(data.twitter_username){
        $('#twitter').text("https://twitter.com/"+data.twitter_username);
        $('#twitter').prop("href","https://twitter.com/"+data.twitter_username);
    }else{
        $('#twitterContainer').hide();
    }
    $('.link').text(data.url)
    $('.link').prop("href", data.html_url)
}

function renderRepos(repos) {
    var reposContainer = $('.repos');
    if (repos.length > 0) {
        repos.forEach(function (repo) {
            var repoCard = $('<div class="card-repo"></div>');
            repoCard.append(`<h2 class="repo-title">${repo.name}</h2>`);
            repoCard.append(`<label class="des">${repo.description}</label>`);
            var topics = $('<div class="topics"></div>');
            repo.topics.forEach(function (topic) {
                var button = $(`<button class="topic-btn">${topic}</button>`);
                topics.append(button);
            });
            repoCard.append(topics);
            reposContainer.append(repoCard);
        });
    }
}



$(document).ready(function () {
    $(".info").hide();
    $(".loading").hide();
    $(".repo-link").hide();
    $('.search-form').submit(handleFormSubmission);


    function simulateExample() {
        $('#search').prop("value", "swarupe7");
        $('#submit').click();
    }
    simulateExample();
});
