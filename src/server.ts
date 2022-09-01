import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Image URL Regex
  const urlRegex = /(http(s?):)([\/|.|\w|\s|-])*\.(?:jpg$|gif$|png$|webp$|jpeg$)|([\/|.|\w|\s|-])*\.(?:jpg$|gif$|png$|webp$|jpeg$)/
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
   app.use(function (req:express.Request, res:express.Response, next:express.NextFunction) {
    if (req.path != '/filteredimage') {
      res.send("try GET /filteredimage?image_url={{}}")
    }
    next()
  })

  //Validate image url
  app.get( "/filteredimage", async (req, res) => {
    let { image_url } = req.query;
    //let image_url_string=image_url.toString();
    //Return error if there is no image url
    if ( !image_url ) {
        res.status(400).send(`Image URL is required`);
      }
      //If image URL is present, match submitted url to common picture formats
      else {
        //return error if url is invalid i.e. does not contain .jpg, .png etc.
        if (!image_url.match(urlRegex)) {
              res.status(400).send("image url format is incorrect, example url : https://example.com/image.png or https://example.com/image.jpg")
      }else {        
        try {
          let submittedUrl = await filterImageFromURL(image_url)
          // Validation for submitted url
          if(submittedUrl != "no image found"){
            res.status(200).sendFile(submittedUrl, async callback=>{

              //delete local files
              await deleteLocalFiles([submittedUrl])
            })
          } else {
            res.status(200).send("no image found in the given url")
          }
        } catch (err) {
          // Error handling in case of other errors
          console.error(err)
          res.status(200).send("image processing failed")
        }
      }
    }
  } );

  
  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();