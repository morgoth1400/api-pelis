async function userDetails() {
  const userDetailsDiv = document.getElementById("user-profile");
  try {
    const response = await fetch(`/username`);

    if (!response.ok) {
      throw new Error("Error al obtener ID del usuario.");
    }

    const user = await response.json();
    console.log(user.user);
    try {
      const response = await fetch(`/userInfo/${user.user}`);

      const userInfo = await response.json();

      // Rellenar la plantilla con los detalles de la película
      userDetailsDiv.innerHTML = `
            <h2>${userInfo.username}</h2>
            <p><strong>Fullname:</strong> ${userInfo.fullname}</p>
            <p><strong>Account state:</strong> ${userInfo.account_state}</p>
        `;
    } catch (error) {
      console.error("Error al obtener detalles del usuario:", error);
      userDetailsDiv.innerHTML = "Error al obtener detalles del usuario.";
    }
  } catch (error) {
    console.error("Error al obtener ID del usuario:", error);
    userDetailsDiv.innerHTML = "Error al obtener ID del usuario.";
  }
}

window.onload = userDetails();
