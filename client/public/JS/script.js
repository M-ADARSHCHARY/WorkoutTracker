let edit_btns = document.querySelectorAll(".edit-btn"); // access all edit-btn's
let save_btns = document.querySelectorAll(".save-btn"); // access all save-btn's
let del_btns = document.querySelectorAll(".delete-btn");
let delAll = document.querySelector(".Del-All");

//  check Clicked or not for every button (so forEach to target all button's)
edit_btns.forEach((editButton) => {
  // event listener on individual button
  editButton.addEventListener("click", (event) => {
    /*If button clicked access that <tr></tr> where it contains all row data*/
    let clicked_tr = event.target.closest("tr");
    //select all spans (class="editable")
    let allSpans = clicked_tr.querySelectorAll(".editable");
    // select save-btn of table row
    let save_btn = clicked_tr.querySelector(".save-btn");

    editButton.style.display = "none"; // hide edit button
    save_btn.style.display = "inline"; // show save button
    // disabled = true for all buttons
    /* when you reload the page,
                 all the button states will reset because the page reload
                  clears any JavaScript changes made to the DOM. */
    edit_btns.forEach((btn) => {
      btn.disabled = true;
    });
    // disable all del buttons
    // let del_btn = clicked_tr.querySelector(".delete-btn");
    del_btns.forEach((delBtn) => {
      delBtn.style.display = "none";
    });

    // run loop on span's
    allSpans.forEach((el) => {
      let input = document.createElement("input"); // create input tag
      input.name = el.getAttribute("name"); // get name attribute value
      if (el.getAttribute("name") == "workoutdate") {
        input.type = "date"
      }else {
        input.value = el.innerText; // span innerText => input innerText
      }

      input.style.width = "100%"; // Make input take full width inside cell
      input.style.maxWidth = "150px"; // Restrict max width to avoid overflow
      input.style.overflow = "hidden"; // Prevent content overflow
      input.style.textOverflow = "ellipsis";
      el.replaceWith(input); // replace span with input tag
      input.style.backgroundColor="#E0E0E0"
    });

    // ================================
    // listen to that save button
    save_btn.addEventListener("click", (event) => {
      let clicked_tr = event.target.closest("tr"); // returns <tr> DOM element (button clicked)
      let input_tags = clicked_tr.querySelectorAll("input");
      let data = {};
      // travel every input tag and access data
      input_tags.forEach((tag) => {
        data[tag.name] = tag.value; // create js object
      });
      data["id"] = clicked_tr.getAttribute("row-id"); // add id also , to send to /edit route

      // fetch returns promise
      fetch("/wt/edit", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json", // Specifies we're sending JSON data
        },
        body: JSON.stringify(data), // Convert js object into JSON and add to req.body
      })
        .then((response) => {
          // promise success so,show response sent from express to user in alert
          // text() => returns promise ( convert (response object to text))
          response.text().then((text) => {
            alert("" + text);
            window.location.reload(); // reload the same page
          });
        })
        .catch((error) => {
          alert("Failed to save data");
          window.location.reload();
        });
    }); // save-btn event listener close
  }); // clicked button event listener close (editButton)
}); // for each close

/*  IMPORTANT NOTE :You need to tell
         Express to serve static files (like JavaScript, CSS, images, etc.) 
         from the public folder. You can do this by using the express.static
        middleware. */

// delete request
del_btns.forEach((delBtn) => {
  delBtn.addEventListener("click", (event) => {
    let clicked_tr = event.target.closest("tr");
    let id = clicked_tr.getAttribute("row-id");
    fetch(`/wt/delete/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        response.text().then((text) => {
          alert(text);
          window.location.reload();
        });
      })
      .catch((err) => {
        alert("Delete Failed");
        window.location.reload();
      });
  });
});

delAll.addEventListener("click", (event) => {
  fetch("/wt/deleteAll", {
    method: "DELETE",
  })
    .then((res) => {
      alert("Deleted SuccessFully");
      window.location.href = "/wt";
    })
    .catch((err) => {
      alert("Not deleted");
    });
});
