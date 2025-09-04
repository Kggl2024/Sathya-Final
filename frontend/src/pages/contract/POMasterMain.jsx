import { useEffect, useState } from 'react';
import POMasterCreation from './POMasterCreation'
import axios from 'axios';

const POMasterMain = () => {

      const [companies, setCompanies] = useState([]);

      const fetchCompanies = async () => {
        try {
        const response = await axios.get("http://localhost:5000/project/companies");
        setCompanies(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
        console.error("Error fetching companies:", error);
        setCompanies([]);
        }
      };

        useEffect(() => {
            fetchCompanies();
        }, []);
  return (
    <>
        <POMasterCreation companies={companies}/>
    </>
  )
}

export default POMasterMain