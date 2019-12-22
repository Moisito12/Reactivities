import React, {useState, useEffect, Fragment} from 'react';
import { Container } from 'semantic-ui-react'
import axios from 'axios';
import { IActivity } from '../models/activity';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';



const App = () => {
  // Se genera el array de activities para mandarlos a llamar en el dashboard y desplazar el array de contenidos
  const [activities, setActivities] = useState<IActivity[]>([]);
  // se agregan las constantes uso para seleccionar actividades una por una
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
  // se agregan constantes para mostrar el editado de las actividades al presionar editar de inicio se manda en falso
  const [editMode, setEditMode] = useState(false);

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter(a => a.id === id)[0]);
    setEditMode(false);
  }

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  }

  const handleCreateActivity = (activity: IActivity) => {
    setActivities([...activities, activity]);
    setSelectedActivity(activity);
    setEditMode(false);
  }

  const handleEditActivity = (activity: IActivity) => {
    setActivities([...activities.filter(a => a.id !== activity.id), activity]);
    setSelectedActivity(activity);
    setEditMode(false);
  }

  const handleDeleteActivity = (id: string) => {
    setActivities([...activities.filter(a => a.id !== id)]);
  }

  useEffect(() =>{
    axios.get<IActivity[]>('http://localhost:5000/api/activities')
      .then((response)=>{
        let activities:IActivity[] = [];
        response.data.forEach(activity => {
          activity.date = activity.date.split('.')[0];
          activities.push(activity);
        })
        setActivities(activities);
      });
  },[]);

  // componentDidMount(){
  //   axios.get<IActivity[]>('http://localhost:5000/api/activities')
  //     .then((response)=>{
  //       this.setState({
  //         activities: response.data
  //       })
  //     })
  // }

    return (
      <Fragment>
        <NavBar openCreateForm={handleOpenCreateForm} />
         <Container style={{marginTop: '7em'}}>
            <ActivityDashboard 
            activities={activities} 
            selectActivity={handleSelectActivity} 
            selectedActivity={selectedActivity}
            editMode={editMode}
            setEditMode={setEditMode}
            setSelectedActivity={setSelectedActivity}
            createActivity={handleCreateActivity}
            editActivity={handleEditActivity}
            deleteActivity={handleDeleteActivity}
            />
         </Container>
          
      </Fragment>
    );
}

export default App;
