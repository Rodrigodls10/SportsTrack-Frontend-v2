import ActivityImageUpload from "./ActivityImageUpload";
import ActivityAIAnalysis from "./ActivityAIAnalysis";

const ActivityCard = ({
    actividad,
    nombreCategoria,
    onEditar,
    onEliminar,
    onActualizar
}) => {
    return (
        <article className="activity-card">

            {actividad.imagenUrl && (
                <div className="activity-card-image">
                    <img
                        src={actividad.imagenUrl}
                        alt={actividad.titulo}
                    />
                </div>
            )}

            <div className="activity-card-content">

                <div className="activity-card-header">
                    <span className="activity-category">
                        {nombreCategoria}
                    </span>

                    <span className="activity-date">
                        {new Date(
                            actividad.fecha
                        ).toLocaleDateString("es-UY")}
                    </span>
                </div>

                <h3>
                    {actividad.titulo}
                </h3>

                <p className="activity-description">
                    {actividad.descripcion}
                </p>

                <div className="activity-info">
                    <span>
                        ⏱️ {actividad.duracionMinutos} min
                    </span>
                </div>

                <ActivityAIAnalysis
                    actividad={actividad}
                    onAnalisisActualizado={onActualizar}
                />

                <ActivityImageUpload
                    actividadId={actividad._id}
                    onImagenSubida={onActualizar}
                />

                <div className="activity-actions">
                    <button
                        type="button"
                        className="btn-edit"
                        onClick={onEditar}
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        className="btn-delete"
                        onClick={onEliminar}
                    >
                        Eliminar
                    </button>
                </div>

            </div>
        </article>
    );
};

export default ActivityCard;