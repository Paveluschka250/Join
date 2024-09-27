async function loadHeader() {
  try {
    const response = await fetch("/patials/header.html");
    if (!response.ok) {
        console.error("keine Datai namen header.html gefunden")
    }
    const data = await response.text();
    document.getElementById("header").innerHTML = data;
  } catch (error) {
    console.error("Error in load_header: ", error)
  }
}
loadHeader();

async function loadSidebar() {
  try {
    const response = await fetch("/patials/sidebar.html");
    if (!response.ok) {
        console.error("keine Datai namen sidebar.html gefunden")
    }
    const data = await response.text();
    document.getElementById("sidebar").innerHTML = data;
  } catch (error) {
    console.error("Error in load_sidebar: ", error)
  }
}
loadSidebar();
