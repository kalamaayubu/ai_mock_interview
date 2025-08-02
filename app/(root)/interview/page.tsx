import Agent from "@/components/Agent";
// import { getCurrentUser } from "@/lib/actions/auth.action";

const InterviewGenerationPage = async () => {
//   const user = await getCurrentUser();

  return (
    <>
      <h3>Interview generation</h3>

      <Agent
        userName={`Agent`}
        userId={"user1"}
        type="generate"
      />
    </>
  );
};

export default InterviewGenerationPage;