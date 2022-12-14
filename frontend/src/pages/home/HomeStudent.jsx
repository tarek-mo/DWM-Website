import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import useStudentContext from "../../hooks/useStudentContext";
import { HomeIcon } from "../../assets/icons";
import AnnonceCard from "../../components/AnnonceCard";
import "./home.scss";
import useAuthContext from "../../hooks/useAuthContext";
import Spinner from "../../components/Spinner";
import { Check2All, FileEarmarkText } from "react-bootstrap-icons";
const HomeStudent = () => {
  const { user } = useAuthContext();
  const { getStudentRelatedAnnonces, isLoading, studentRelatedAnnonces } =
    useStudentContext();

  useEffect(() => {
    getStudentRelatedAnnonces();
  }, [user]);

  if (isLoading)
    return (
      <div className="home container-fluid">
        <div className="spinner-container">
          <Spinner />
        </div>
      </div>
    );
  return (
    <div className="home container-fluid">
      <aside>
        <Link to="/etudiant/mesnotes">
          <Check2All color="royalblue" size={20} />
          <span>Consulter les notes</span>
        </Link>
        <Link to="/etudiant/mescours">
          <FileEarmarkText color="royalblue" size={20} />
          <span>Consulter les modules</span>
        </Link>
      </aside>
      <main>
        {studentRelatedAnnonces.length > 0
          ? studentRelatedAnnonces.map((annonce) => (
              <AnnonceCard key={annonce.id} {...annonce} />
            ))
          : "Aucune post existent actuellement"}
      </main>
    </div>
  );
};

export default HomeStudent;
