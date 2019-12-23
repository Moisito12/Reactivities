import React, {useState, useEffect, Fragment, SyntheticEvent} from 'react';
import { Container } from 'semantic-ui-react'
import { IActivity } from '../models/activity';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';



const App = () => {
  // Se genera el array de activities para mandarlos a llamar en el dashboard y desplazar el array de contenidos
  const [activities, setActivities] = useState<IActivity[]>([]);
  // se agregan las constantes uso para seleccionar actividades una por una
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
  // se agregan constantes para mostrar el editado de las actividades al presionar editar de inicio se manda en falso
  const [editMode, setEditMode] = useState(false);
  // Método para mostrar la barra de cargando en en los componentes
  const [loading, setLoading] = useState(true);
  // Agregando el metodo de cargando al envío de los datos
  const [submitting, setSubmitting] = useState(false);
  const [target, setTarget] = useState('');
  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter(a => a.id === id)[0]);
    setEditMode(false);
  }

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  }

  const handleCreateActivity = (activity: IActivity) => {
    // en app/api agregamos el archivo agent.ts para modificar las propidades en la base de datos
    agent.Activities.create(activity).then(() =>{
      setSubmitting(true);
      setActivities([...activities, activity])
      setSelectedActivity(activity);
      setEditMode(false);
    }).then(() => setSubmitting(false));
  }

  const handleEditActivity = (activity: IActivity) => {
    setSubmitting(true);
    agent.Activities.update(activity).then(() =>{
      setActivities([...activities.filter(a => a.id !== activity.id), activity])
      setSelectedActivity(activity);
      setEditMode(false);
    }).then(() => setSubmitting(false));
  }

  const handleDeleteActivity = (event: SyntheticEvent<HTMLButtonElement>,id: string) => {
    setSubmitting(true);
    setTarget(event.currentTarget.name);
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(a => a.id !== id)]);
    }).then(() => setSubmitting(false));
  }

  useEffect(() => {
    agent.Activities.list()
      .then(response => {
        let activities: IActivity[] = [];
        response.forEach((activity) => {
          activity.date = activity.date.split('.')[0];
          activities.push(activity);
        })
        setActivities(activities);
      }).then(() => setLoading(false));
  },[]);

  if(loading) return <LoadingComponent content='Loading Activities...' />

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
          submitting={submitting}
          target={target}
        />
        </Container>
        
    </Fragment>
  );
}

export default App;
