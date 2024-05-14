import React from "react";
import { CircularProgress } from "@mui/material";
import dynamic from "next/dynamic";
import BaseCard from "../baseCard/BaseCard";
import { useRouter } from "next/router";
import useAxios from "../../utils/useAxios";
import BlogCard from "./BlogCard";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import DebtsCard from "./DebtsCard";
import dayjs from "dayjs";


const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
 
export default function Dashboard (props) {
  const [loading, setLoading] = React.useState(false);
  const [yearstatistics, setYearstatistics] = React.useState([])
  const [openVer, setOpenVer] = React.useState(false);
  const [searchString, setSearchString] = React.useState(undefined);

  const { origin }  = props;
  //const { logoutUser } = useContext(AuthContext);

  const handleCloseVer = (event, reason) => {
    if (reason === "backdropClick") {
      console.log(reason);
    } else {
      setOpenVer(false);
    }
  };
  React.useEffect(() => {
    console.log("origiiiin   :  ", origin);
    const fetchAllProfiles = () => {
      fetch(
        `${origin}/api/propriete${
          searchString ? `?search=${searchString}&limit=20` : '?limit=20'
        }`,
        {
          method: 'GET',
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            if (data.message === 'Query failed: planning failure') {
              throw new Error(
                `Query Failed. Be sure to run \`npm run build-indexes\`!`
              );
            }
            if (
              data.message === 'Query failed: bucket not found' ||
              data.message === 'Query failed: parsing failure'
            ) {
              setIsBucketNotFoundNotificationOpen(true);
              throw new Error(
                data.message +
                  '\n' +
                  'Be sure to use a bucket named `user_profile`, a scope named `_default`, and a collection named `profile`' +
                  '\n' +
                  'See the "Common Pitfalls and FAQ" section of the README for more information.'
              );
            }

            throw new Error(data.message);
          }

          //data.sort((a, b) => a.firstName.localeCompare(b.firstName)); // Sort the profiles alphabetically by name

          //setUserProfiles(data);
          //setIsProfilesLoading(false);
          //setSelectedProfile(data[0]);
          

          console.log(data);
        });
    };
    fetchAllProfiles();

/*     if(localStorage.getItem("currentYear")){
      setLoading(true)
      axios.get(`point/operations/yearstatistics?yearId=${JSON.parse(localStorage.getItem("currentYear")).id}`).then(
        res => {
          console.log("yearstatistics  : ",res.data);
          setYearstatistics(res.data);
        }, 
        error => {
          console.log(error)
          if(error.response && error.response.status === 401)
          logoutUser()
        }
      ) 
      .then(() => {
        setLoading(false)
      })
    } */
  }, [searchString, origin])

  const options = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      //stackType: '100%',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: true
      }
    },
    colors: ["#6ebb4b", "#079ff0" //, "#cc7c67", "#1a7795"
  ],
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0
        }
      }
    }],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 10,
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: '13px',
              fontWeight: 900
            }
          }
        }
      },
    },
    xaxis: {
      //type: 'datetime',
      categories: [
        "Jan يناير",
        "Fev فبراير",
        "Mar مارس",
        "Avr ابريل",
        "Mai مايو",
        "Juin يونيو",
        "Juil يوليو",
        "Aout  أغشت",
        "Sept سبتمبر",
        "Oct أكتوبر",
        "Nov  نفمبر",
        "Dec ديسمبر"
      ],
    },
    yaxis: {
      show: true,
      min: 0,
      max: yearstatistics.length > 0 ? yearstatistics[12].operationValid : 0,
      tickAmount: 3,
      labels: {
        style: {
          cssClass: "grey--text lighten-2--text fill-color",
        },
      },
    },
    legend: {
      position: 'right',
      offsetY: 40
    },
    fill: {
      opacity: 1
    }
  }


  const seriesyearstatistics = [
    {
      name: "Retrait السحب",
      data: [
        yearstatistics.length > 0 && yearstatistics[0].operationRetrait,
        yearstatistics.length > 0 && yearstatistics[1].operationRetrait,
        yearstatistics.length > 0 && yearstatistics[2].operationRetrait,
        yearstatistics.length > 0 && yearstatistics[3].operationRetrait,
        yearstatistics.length > 0 && yearstatistics[4].operationRetrait,
        yearstatistics.length > 0 && yearstatistics[5].operationRetrait,
        yearstatistics.length > 0 && yearstatistics[6].operationRetrait,
        yearstatistics.length > 0 && yearstatistics[7].operationRetrait,
        yearstatistics.length > 0 && yearstatistics[8].operationRetrait,
        yearstatistics.length > 0 && yearstatistics[9].operationRetrait,
        yearstatistics.length > 0 && yearstatistics[10].operationRetrait,
        yearstatistics.length > 0 && yearstatistics[11].operationRetrait
      ],
    },
    {
      name: "Versement الإيداع",
      data: [
        yearstatistics.length > 0 && yearstatistics[0].operationVersement,
        yearstatistics.length > 0 && yearstatistics[1].operationVersement,
        yearstatistics.length > 0 && yearstatistics[2].operationVersement,
        yearstatistics.length > 0 && yearstatistics[3].operationVersement,
        yearstatistics.length > 0 && yearstatistics[4].operationVersement,
        yearstatistics.length > 0 && yearstatistics[5].operationVersement,
        yearstatistics.length > 0 && yearstatistics[6].operationVersement,
        yearstatistics.length > 0 && yearstatistics[7].operationVersement,
        yearstatistics.length > 0 && yearstatistics[8].operationVersement,
        yearstatistics.length > 0 && yearstatistics[9].operationVersement,
        yearstatistics.length > 0 && yearstatistics[10].operationVersement,
        yearstatistics.length > 0 && yearstatistics[11].operationVersement
      ],
    }
  ];  

  return (
    <>
    {loading ? (
      <div 
          style={{
            width:'100%', 
            marginTop:'25%',
            display:'flex',
            justifyContent:'center'
          }} 
        >
      <CircularProgress
          size={60}
          sx={{
            color: 'primary',
          }}
      />
    </div>

      ) : (<>
    <BaseCard titleColor={"secondary"} title={`DES STATISTIQUES SUR PROPRIETES`}>

      {/* <BaseCard titleColor={"secondary"} title={`NOMBRE D'OPPERATIONS PAR MOIS`}>
        {yearstatistics.length > 0 && yearstatistics[12].operationValid > 0 ?
          <Chart
            options={options}
            series={seriesyearstatistics}
            type="bar"
            height="295px"
          />
          :
          <div style={{width:'100%', fontSize:'20px', display:'flex', justifyContent:'center'}}>
            Liste vide
          </div>
        } 
      </BaseCard> */}
      {/* {yearstatistics.length > 0 &&
      <BlogCard statics = {yearstatistics} />
      } */}
    </BaseCard>
    </>
    )
  }
  </>
  );
};



