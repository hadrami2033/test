import React from "react";
import { Card, CardContent, Typography, Button, Grid, Tooltip } from "@mui/material";
import { SheetJSFT } from "../../lib/types";


const BlogCard = (props) => {
  const {clientsCount, numbersCount, selectFile, fileName, handleFile, verifyCompatibility} = props;

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
            }}
          >
            <CardContent
              sx={{
                paddingLeft: "30px",
                paddingRight: "30px",
              }}
            >
              <Typography
                color="primary"
                sx={{
                  fontSize: "h1.fontSize",
                  fontWeight: "1000",
                  fontStyle:'initial',
                  display:'flex', 
                  justifyContent: 'center'
                }}
              >
                {clientsCount}
              </Typography>
              <Typography
                color="primary"
                sx={{
                  fontSize: "h2.fontSize",
                  fontWeight: "400",
                  marginTop:1,
                  display:'flex', 
                  justifyContent: 'center',
                }}
              >
                 مجموع الزبناء
              </Typography>
              {/* <Button
                variant="contained"
                sx={{
                  mt: "15px",
                }}
                color={'primary'}
              >
                Learn More
              </Button> */}
            </CardContent>
          </Card>

        </Grid>

        <Grid
          item
          xs={6}
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
            }}
          >
            <CardContent
              sx={{
                paddingLeft: "30px",
                paddingRight: "30px",
              }}
            >
              <Typography
                color="secondary"
                sx={{
                  fontSize: "h1.fontSize",
                  fontWeight: "1000",
                  fontStyle:'initial',
                  display:'flex', 
                  justifyContent: 'center'
                }}
              >
                {numbersCount}
              </Typography>
              <Typography
                color="secondary"
                sx={{
                  fontSize: "h2.fontSize",
                  fontWeight: "400",
                  marginTop:1,
                  display:'flex', 
                  justifyContent: 'center',
                }}
              >
                 مجموع الأرقام
              </Typography>
              {/* <Button
                variant="contained"
                sx={{
                  mt: "15px",
                }}
                color={'primary'}
              >
                Learn More
              </Button> */}
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
            }}
          >
            <CardContent
              sx={{
                paddingLeft: "30px",
                paddingRight: "30px",
              }}
            >
              <Typography
                color="primary"
                sx={{
                  fontSize: "h2.fontSize",
                  fontWeight: "600",
                  fontStyle:'initial',
                  display:'flex',
                  justifyContent: 'center'
                }}
              >
                  مطابقة ارقام مورد
              </Typography>
              <Typography
                sx={{
                  display:'flex',
                  justifyContent: 'center',
                  alignItems:'center',
                  height:'100%'
                }}
              >
                
              <Button
                variant="contained"
                onClick={verifyCompatibility}
                sx={{
                  fontSize: "h2.fontSize",
                  fontWeight: "800",
                  mt: "15px",
                  marginTop:1,
                  width:'100%'
                }}
                color={'primary'}
              >
                 إجراء مطابقة
              </Button> 
              </Typography>
            </CardContent>
          </Card>

        </Grid>
      {fileName ?
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
            }}
          >
            <CardContent
              sx={{
                paddingLeft: "30px",
                paddingRight: "30px",
              }}
            >
              <Typography
                color="secondary"
                sx={{
                  fontSize: "h2.fontSize",
                  fontWeight: "200",
                  fontStyle:'initial',
                  display:'flex',
                  justifyContent: 'center'
                }}
              >
              {fileName}
              </Typography>
              <Typography
                sx={{
                  display:'flex',
                  justifyContent: 'center',
                  alignItems:'center',
                  height:'100%'
                }}
              >
                <Button
                  variant="contained"
                  title="حذف أرقام الملف"
                  sx={{
                    fontSize: "h2.fontSize",
                    fontWeight: "800",
                    mt: "15px",
                    marginTop:1,
                    width:'100%'
                  }}
                  color={'secondary'}
                  onClick={handleFile}
                >
                  حذف الأرقام
                </Button> 

              </Typography>
            </CardContent>
          </Card>

        </Grid>
        :
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
            }}
          >
            <CardContent
              sx={{
                paddingLeft: "30px",
                paddingRight: "30px",
              }}
            >
              <Typography
                color="secondary"
                sx={{
                  fontSize: "h2.fontSize",
                  fontWeight: "600",
                  fontStyle:'initial',
                  display:'flex',
                  justifyContent: 'center'
                }}
              >
              حذف مجموعة أرقام
              </Typography>
              <Typography
                sx={{
                  display:'flex',
                  justifyContent: 'center',
                  alignItems:'center',
                  height:'100%'
                }}
              >
              <Tooltip variant="contained" component="label" title="اختر ملف">
                <Button
                  variant="contained"
                  sx={{
                    fontSize: "h2.fontSize",
                    fontWeight: "800",
                    mt: "15px",
                    marginTop:1,
                    width:'100%'
                  }}
                  color={'secondary'}
                  aria-label="import"
                >
                  اختر ملف
                  <input type="file" hidden accept={SheetJSFT} onChange={selectFile} />
                </Button> 
              </Tooltip>

              </Typography>
            </CardContent>
          </Card>

        </Grid>
      }
    </Grid>
  );
};

export default BlogCard;
