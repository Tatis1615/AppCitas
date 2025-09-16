// import React, { useState } from "react";
// import { View, Text, TextInput, Button } from "react-native";

// export default function EditarCita({ route, navigation }) {
//   const { cita } = route.params;
//   const [ paciente_id, setPacienteId ] = useState(cita.paciente_id);
//   const [ medico_id, setMedicoId ] = useState(cita.medico_id);
//   const [ consultorio_id, setConsultorioId ] = useState(cita.consultorio_id);
//   const [ fecha_hora, setFecha_hora ] = useState(cita.fecha_hora);
//   const [ estado, setEstado ] = useState(cita.estado);
//   const [ motivo, setMotivo ] = useState(cita.motivo);


//     return (
//         <View style={{ flex: 1, padding: 20 }}>
//             <Text style={{ fontSize: 22 }}>Editar Cita</Text>

//             <Text>Paciente ID:</Text>
//             <TextInput
//                 value={String(paciente_id)}
//                 onChangeText={setPacienteId}
//                 keyboardType="numeric"
//                 style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
//             />
//             <Text>Medico ID:</Text>
//             <TextInput
//                 value={String(medico_id)}
//                 onChangeText={setMedicoId}
//                 keyboardType="numeric"
//                 style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
//             />
//             <Text>Consultorio ID:</Text>
//             <TextInput
//                 value={String(consultorio_id)}  
//                 onChangeText={setConsultorioId}
//                 keyboardType="numeric"
//                 style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
//             />
//             <Text>Fecha y Hora:</Text>
//             <TextInput
//                 value={fecha_hora}
//                 onChangeText={setFecha_hora}
//                 style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
//             />
//             <Text>Estado:</Text>
//             <TextInput  
//                 value={estado}
//                 onChangeText={setEstado}
//                 style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
//             />
//             <Text>Motivo:</Text>
//             <TextInput
//                 value={motivo}
//                 onChangeText={setMotivo}
//                 style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
//             />

//         <Button
//             title="Guardar"
//             onPress={() => {
//             // Aquí podrías guardar cambios en una BD, por ahora simulamos:
//             alert(`Medico actualizado: paciente_id: ${paciente_id}, medico_id: ${medico_id}, consultorio_id: ${consultorio_id}, 
//                 fecha_hora: ${fecha_hora}, estado: ${estado}, motivo: ${motivo}`);
//             navigation.goBack();
//             }}
//         />
//         </View>
//   );
// }
