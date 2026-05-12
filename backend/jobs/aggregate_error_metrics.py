import datetime
import csv
from pathlib import Path
from sqlalchemy import create_engine, func
from sqlalchemy.orm import sessionmaker
from cloud_lab.models import Base, ErrorEvent, ResolutionEvent, MetricsSnapshot

def aggregate_metrics():
    engine = create_engine('postgresql://axentx:securepassword@localhost/cloud_lab')
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        # Calculate resolution success rates by error code
        resolution_stats = session.query(
            ErrorEvent.error_code,
            func.count(ErrorEvent.id).label('total_errors'),
            func.count(ResolutionEvent.id).label('resolved_errors')
        ).outerjoin(ResolutionEvent, ErrorEvent.id == ResolutionEvent.error_id) \
         .group_by(ErrorEvent.error_code).all()

        # Calculate average time-to-resolution
        time_stats = session.query(
            func.avg(ResolutionEvent.resolution_time - ErrorEvent.detection_time).label('avg_resolution_time')
        ).join(ResolutionEvent).filter(
            ResolutionEvent.successful == True
        ).scalar()

        # Create new metrics snapshot
        metrics = MetricsSnapshot(
            timestamp=datetime.datetime.utcnow(),
            overall_success_rate=sum(r[1] for r in resolution_stats) / max(1, sum(r[2] for r in resolution_stats)),
            avg_resolution_time=time_stats or datetime.timedelta(0),
            error_breakdown=[
                {
                    'error_code': code,
                    'total': total,
                    'resolved': resolved,
                    'success_rate': resolved / max(1, total)
                } for code, total, resolved in resolution_stats
            ]
        )
        
        session.add(metrics)
        session.commit()

        # Export to CSV
        export_path = Path('/opt/axentx/cloud-lab/backend/data/metrics_export_') \
            .joinpath(datetime.datetime.now().strftime('%Y%m%d%H%M%S') + '.csv')
        
        with open(export_path, 'w', newline='') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=[
                'error_code', 'total_errors', 'resolved_errors', 'success_rate',
                'avg_resolution_hours'
            ])
            writer.writeheader()
            
            for code, total, resolved in resolution_stats:
                writer.writerow({
                    'error_code': code,
                    'total_errors': total,
                    'resolved_errors': resolved,
                    'success_rate': f"{(resolved/total)*100:.2f}%",
                    'avg_resolution_hours': f"{(time_stats.total_seconds()/3600):.2f}h" if time_stats else 'N/A'
                })

    except Exception as e:
        session.rollback()
        raise
    finally:
        session.close()

if __name__ == '__main__':
    aggregate_metrics()