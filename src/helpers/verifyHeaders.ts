import { verify } from "jsonwebtoken";

const withoutAuthorize = (req, res, next) => {
    let content_type = req.headers['content-type'];
    if (content_type == 'application/json') {
      next();
    } else {
      return res.code(400).send({
        statusCode: 400,
        message: 'Content-Type must JSON!'
      })
    }
  }
const withAuthorize = async (req, res, next) => {
    let content_type = req.headers['content-type'];
    if (content_type == 'application/json') {
      let authorize = req.headers.authorization;
      if (authorize) {
        const token = authorize.slice(7);
        verify(token, process.env.SECRET_KEY, async (err: any, decoded: any) => {
          if (err) {
            return res.code(401).send({
              statusCode: 401,
              message: 'Invalid access token!'
            })
          } else {
            // const user: any = await _user.getUserById_simple(decoded.id);
            // if (Object.keys(user).length <= 0) {
            //   return res.code(401).send({
            //     statusCode: 401,
            //     message: 'Your token is not registered!'
            //   })
            // }
            next();
          }
        });
      } else {
        return res.code(401).send({
          statusCode: 401,
          message: 'Invalid access token!'
        })
      }
    } else {
      return res.code(501).send({
        statusCode: 501,
        message: 'Header must be application/json!'
      })
    }
  }

export {
    withoutAuthorize,
    withAuthorize
}