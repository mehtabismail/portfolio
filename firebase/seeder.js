const admin = require("firebase-admin");
const serviceAccount = require("./portfolio-5787-firebase-adminsdk-fbsvc-c547f15400.json");
const { projectsList } = require("./projects");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function seedProjects() {
  const ref = db.collection("projects");

  await ref.doc("my_projects").set({
    projects: projectsList,
  });

  console.log("Projects seeded successfully.");
}

seedProjects()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error seeding:", err);
    process.exit(1);
  });
