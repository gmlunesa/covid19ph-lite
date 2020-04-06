import "./layout.css"
import React  from "react"
import { Grid, Icon } from 'semantic-ui-react';
const Footer = () => (
  <footer>
    <div>
       <Grid stackable columns={2} verticalAlign='middle'>
        <Grid.Row>
            <Grid.Column>
              <strong>API</strong><br/>
              <Icon name='hospital outline'/><a href="https://ncovtracker.doh.gov.ph/">DOH Philippines</a><br />
              <Icon name='heartbeat'/><a href="https://coronatracker.com/">Corona Tracker</a><br/>
            </Grid.Column>
            <Grid.Column>
            <strong>Code</strong><br/>
              <Icon name='github' /><a href="https://github.com/gmlunesa" target="_blank">Github Repo</a><br />
              <Icon name='user outline' /><a href="https://gmlunesa.github.io" target="_blank">@gmlunesa</a>
            </Grid.Column>
        </Grid.Row>
       </Grid>
    </div>
    
  </footer>
)

export default Footer
