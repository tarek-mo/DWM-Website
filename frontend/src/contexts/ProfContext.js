import { createContext, useState } from "react";
import useAuthContext from "../hooks/useAuthContext";

export const ProfContext = createContext();

const ProfContextProvider = ({ children }) => {
  const { user } = useAuthContext();

  const [profAnnonces, setProfAnnonces] = useState([]);
  const [allAnnonces, setAllAnnonces] = useState([]);
  const [profSubjects, setProfSubjects] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // POST annonce
  const postAnnonce = async (content, year) => {
    setSuccess(null);
    setError(null);
    if (!content) return setError("Le contenu est requis");
    if (!year) return setError("l'année d'étude est requise");
    setIsLoading(true);
    const response = await fetch("/api/annonces", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer: ${user.token}`,
      },
      body: JSON.stringify({ content, year }),
    });
    const json = await response.json();
    if (response.ok) {
      setSuccess("Annonce publié avec success");
      setProfAnnonces((prevAnnonces) => ({ ...prevAnnonces, json }));
    } else {
      setError(json.error);
    }
    setIsLoading(false);
  };

  // GET prof annonces
  const getProfAnnonces = async () => {
    setIsLoading(true);
    if (!user) return;
    const response = await fetch("/api/annonces", {
      method: "GET",
      headers: {
        Authorization: `Bearer: ${user.token}`,
      },
    });

    const json = await response.json();
    setProfAnnonces(json);
    setIsLoading(false);
  };

  // DELETE Annonce
  const deleteAnnonce = async (annonceID) => {
    const response = await fetch(`/api/annonces/${annonceID}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setProfAnnonces(
        profAnnonces.filter((annonce) => annonce._id !== annonceID)
      );
      return true;
    }
    return false;
  };

  // GET all annonces
  const getAllAnnonces = async () => {
    const response = await fetch("/api/annonces/all");
    const json = await response.json();
    return json;
  };

  const getAnnoncesWithAnnocersData = async () => {
    setIsLoading(true);
    const json = await getAllAnnonces();
    const annonces = [];
    for (let i = 0; i < json.length; i++) {
      const currentEl = json[i];
      const response = await fetch(`/api/profs/${currentEl.profID}`);
      const prof = await response.json();
      const annonce = {
        id: currentEl._id,
        content: currentEl.content,
        year: currentEl.year,
        createdAt: currentEl.createdAt,
        profUsername: prof.username,
        profEmail: prof.email,
      };
      annonces.push(annonce);
    }
    setAllAnnonces(annonces);
    setIsLoading(false);
  };

  // GET prof subjects
  const getProfSubjects = async () => {
    setIsLoading(true);
    if (!user) return;
    const response = await fetch("/api/subjects/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    if (response.ok) {
      const json = await response.json();
      setProfSubjects(json);
      setIsLoading(false);
    }
  };

  // POST mark
  const postMark = async (marksData) => {
    console.log("mark data", marksData);
    setError(null);
    setSuccess(null);
    if (!user || !user.admin) return setError("Pas authorizé");
    let success = null;
    let error = null;
    for (let i = 0; i < marksData.length; i++) {
      const markData = marksData[i];

      const { studentName, subjectName, mark } = markData;
      if (!studentName || !subjectName || !mark)
        return setError(
          "Le nom de l'élève, la note de l'élève ou le nom de la matière est manquant"
        );

      const response = await fetch("/api/marks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(markData),
      });

      const json = await response.json();
      if (response.ok) {
        success = json.message;
        console.log("success", success);
      } else {
        error = json.error;
      }
    }
    setSuccess(success);
    setError(error);
  };

  const values = {
    profAnnonces,
    profSubjects,
    error,
    success,
    isLoading,
    setSuccess,
    postAnnonce,
    getProfAnnonces,
    allAnnonces,
    getAnnoncesWithAnnocersData,
    deleteAnnonce,
    getProfSubjects,
    postMark,
    setError,
  };
  return <ProfContext.Provider value={values}>{children}</ProfContext.Provider>;
};

export default ProfContextProvider;
