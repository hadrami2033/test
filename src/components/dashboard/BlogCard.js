import React from "react";
import { Card, CardContent, Typography, Button, Grid, Tooltip, Stack } from "@mui/material";
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import Diversity2Icon from '@mui/icons-material/Diversity2';
import PeopleIcon from '@mui/icons-material/People';

const BlogCard = (props) => {
  const {clientsCount, numbersCount, selectFile, fileName, handleFile, verifyCompatibility} = props;
  //colors: ['#6ebb4b', '#1a7795',  '#a52e36' , '#079ff0', '#cc7c67' , '#c8d789']

  return (
    <Grid container>
    
        <Grid
          xs={12}
          lg={3}
          sx={{
            display: "flex",
            alignItems: "stretch",
          }}
        >
          <Card
            sx={{
              p: 0,
              width: "100%",
              bgcolor:'#6ebb4b'
            }}
          >
            <CardContent
              sx={{
                paddingLeft: "30px",
                paddingRight: "30px",
              }}
            >
            <SentimentSatisfiedAltIcon 
                        fontSize='large'
                        style={{
                          color: "white",
                        }}                      
                      />
              <Typography
                color={"#F6EEFA"}
                sx={{
                  fontSize: "h2.fontSize",
                  fontWeight: "1000",
                  fontStyle:'initial',
                  display:'flex', 
                  justifyContent: 'center'
                }}
              >
                Conventions
              </Typography>
              
              <Typography
                //color="primary"
                color={"#F6EEFA"}
                sx={{
                  fontSize: "h1.fontSize",
                  fontWeight: "1000",
                  fontStyle:'initial',
                  display:'flex', 
                  justifyContent: 'center'
                }}
              >
                 25
              </Typography>
            </CardContent>
          </Card>

        </Grid>

        <Grid
          item
          xs={12}
          lg={3}
          sx={{
            display: "flex",
            alignItems: "stretch",
          }}
        >
          <Card
            sx={{
              p: 0,
              width: "100%",
              bgcolor:'#cc7c67'
            }}
          >
            <CardContent
              sx={{
                paddingLeft: "30px",
                paddingRight: "30px",
              }}
            >
              <PeopleIcon 
                        fontSize='large'
                        style={{
                          color: "white",
                        }}                      
                      />
              <Typography
                color={"#F6EEFA"}
                sx={{
                  fontSize: "h2.fontSize",
                  fontWeight: "1000",
                  fontStyle:'initial',
                  display:'flex', 
                  justifyContent: 'center'
                }}
              >
                Bailleurs
              </Typography>
              <Typography
                //color="primary"
                color={"#F6EEFA"}
                sx={{
                  fontSize: "h1.fontSize",
                  fontWeight: "1000",
                  marginTop:1,
                  display:'flex', 
                  justifyContent: 'center',
                }}
              >
                 300
              </Typography>
            </CardContent>
          </Card>

        </Grid>

        <Grid
          item
          xs={12}
          lg={3}
          sx={{
            display: "flex",
            alignItems: "stretch",
          }}
        >
        

          <Card
            sx={{
              p: 0,
              width: "100%",
              bgcolor:'#c8d789'
            }}
          >
            <CardContent
              sx={{
                paddingLeft: "30px",
                paddingRight: "30px",
              }}
            >

              <PeopleIcon 
                        fontSize='large'
                        style={{
                          color: "white",
                        }}                      
                      />
              <Typography
                color={"#F6EEFA"}
                sx={{
                  fontSize: "h2.fontSize",
                  fontWeight: "1000",
                  fontStyle:'initial',
                  display:'flex', 
                  justifyContent: 'center'
                }}
              >
                Emprunteurs
              </Typography>
              <Typography
                //color="primary"
                color={"#F6EEFA"}
                sx={{
                  fontSize: "h1.fontSize",
                  fontWeight: "1000",
                  marginTop:1,
                  display:'flex', 
                  justifyContent: 'center',
                }}
              >
                 123
              </Typography>
            </CardContent>
          </Card>

        </Grid>
        <Grid
          item
          xs={12}
          lg={3}
          sx={{
            display: "flex",
            alignItems: "stretch",
          }}
        >
          <Card
            sx={{
              p: 0,
              width: "100%",
              bgcolor:'#079ff0'

            }}
          >
            <CardContent
              sx={{
                paddingLeft: "30px",
                paddingRight: "30px",
              }}
            >  

                  <Diversity2Icon 
                        fontSize='large'
                        style={{
                          color: "white",
                        }}                      
                      />
              <Typography
                color={"#F6EEFA"}
                sx={{
                  fontSize: "h2.fontSize",
                  fontWeight: "1000",
                  fontStyle:'initial',
                  display:'flex', 
                  justifyContent: 'center'
                }}
              >
                Engagements
              </Typography>
              <Typography
                //color="primary"
                color={"#F6EEFA"}
                sx={{
                  fontSize: "h1.fontSize",
                  fontWeight: "1000",
                  marginTop:1,
                  display:'flex', 
                  justifyContent: 'center',
                }}
              >
                 45
              </Typography>
            </CardContent>
          </Card>

        </Grid>
    </Grid>
  );
};

export default BlogCard;
